import {
  Put,
  Body,
  Res,
  Get,
  Req,
  UseBefore,
  ApiRequest,
  JsonController,
  AuthTenancyMiddleware,
  Param,
  Product,
  Post,
  InternalServerError,
  ObjectID,
  AuthHandlerMiddleware,
} from '@mypharma/api-core'
import { Response } from 'express'
import {
  CreateGlobalCart,
  DeleteOldCart,
  GetCart,
  GetCupomActive,
  GetCustomerCart,
  GetProductByEAN,
  LoadCustomerByID,
  LoadStoreByID,
  LoadStoreByUrl,
  PutCart,
  UpdateCart,
} from '../services/CartService'
import { IPutCartRequest, PostAddSingleRequest, PutSendCartRequest } from '../interfaces/cart.request'
import { ParseProductCoupom } from '../../../../utils/product-check-coupon'
import { v4 } from 'uuid'
import AMQP from '../../../../services/amqp'

const originToPublishName = {
  'product-detail': 'star-capture',
  'search-result': 'superstar-capture',
}

@JsonController('/v1/cart')
export class CartController {
  @Get('/:fingerprint')
  @UseBefore(AuthTenancyMiddleware)
  public async index(@Req() request: ApiRequest, @Param('fingerprint') fingerprint: string, @Res() response: Response) {
    try {
      const {
        tenant,
        session: { user },
      } = request

      let cart = null
      cart = await GetCart(tenant, fingerprint)

      if (!cart) {
        cart = {
          customerId: user._id,
          products: [],
          productsCupom: [],
        }

        return response.json({
          cart,
        })
      }

      return response.json({
        cart,
      })
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: 'internal_server_error',
      })
    }
  }

  getAddedProduct(newProducts: Product[], cartProducts: Product[]) {
    return cartProducts.filter((cartProduct) => !!newProducts.find((newProduct) => newProduct._id === cartProduct._id))
  }

  @Put('/')
  @UseBefore(AuthTenancyMiddleware)
  public async put(@Req() request: ApiRequest, @Body() body: IPutCartRequest, @Res() response: Response) {
    try {
      const {
        tenant,
        session: { user },
      } = request
      const { products, code, fingerprint } = body
      let cart = null
      let deliveryFree = false
      let cupom = null

      cupom = await GetCupomActive(tenant, code, user._id)
      deliveryFree = cupom && cupom.type === 'delivery' ? true : false

      const parsedProducts = await ParseProductCoupom(tenant, cupom, products)

      cart = await GetCustomerCart(tenant, user._id)

      if (cart) {
        cart.fingerprint !== fingerprint ? await DeleteOldCart(tenant, fingerprint) : null

        cart = {
          ...cart,
          fingerprint,
          products: products,
          productsCupom: parsedProducts,
        }

        const cartId = cart._id
        delete cart._id
        await UpdateCart(tenant, cartId, cart)

        return response.json({
          cart: {
            ...cart,
            code: cupom ? cupom.code : null,
          },
        })
      }

      if (!cart) {
        cart = await GetCart(tenant, fingerprint)

        if (!cart) {
          cart = {
            ...cart,
            fingerprint: v4(),
            email: user.email,
            name: user.fullName,
            customerId: user._id,
            products: products,
            productsCupom: parsedProducts,
            cupom: [],
          }

          cart = await PutCart(tenant, cart)

          return response.json({
            cart: {
              ...cart,
              products: products,
              productsCupom: parsedProducts,
              code: cupom ? cupom.code : null,
            },
          })
        }

        cart = {
          ...cart,
          email: user.email,
          name: user.fullName,
          customerId: user._id,
          products: products,
          productsCupom: parsedProducts,
        }

        const cartId = cart._id
        delete cart._id

        await UpdateCart(tenant, cartId, cart)

        return response.json({
          cart: {
            ...cart,
            code: cupom ? cupom.code : null,
          },
        })
      }
    } catch (error) {
      console.log(error)
      return response.json({
        cart: {
          products: [],
          productsCupom: [],
          code: null,
        },
      })
    }
  }

  @Post('/add-single')
  @UseBefore(AuthHandlerMiddleware)
  public async sendToWatcher(@Req() request: ApiRequest, @Body() body: PostAddSingleRequest) {
    try {
      const { product_ean, origin, customer_id, fingerprint } = body

      const { tenant, session } = request

      const product = await GetProductByEAN(String(product_ean), tenant)

      const storeId = new ObjectID(session.store)
      const customerId = new ObjectID(customer_id)

      const loadedStore = session ? await LoadStoreByID(storeId as any) : await LoadStoreByUrl('https://new-alpha.mypharma.com.br/')
      const user = session && session.user ? session.user : customer_id ? await LoadCustomerByID(customerId as any, tenant) : ''

      // if (product) {
      //   const watcher = {
      //     fingerprint,
      //     store: {
      //       storeId: loadedStore._id,
      //       name: loadedStore.name,
      //       url: loadedStore.url,
      //     },
      //     user: user
      //       ? {
      //           userId: user._id,
      //           firstName: user.firstname,
      //           lastName: user.lastname,
      //         }
      //       : null,
      //     product: {
      //       id: product._id,
      //       ean: product.EAN,
      //       name: `${product.model} ${product.name}`,
      //       price: Number(product.price),
      //       quantity: Number(product.quantity),
      //     },
      //     origin: request.headers['origin'] || '',
      //     userAgent: request.headers['user-agent'] || '',
      //   }
      //   await AMQP.publish(originToPublishName[origin], watcher)
      // }
      return ''
    } catch (error) {
      console.log(error)
      throw new InternalServerError(error.message)
    }
  }

  @Put('/send')
  @UseBefore(AuthTenancyMiddleware)
  public async sendCart(@Req() request: ApiRequest, @Res() response: Response, @Body() body: PutSendCartRequest) {
    try {
      const { products = [], purchased } = body
      const { session: { store, user }, tenant } = request
      const { email } = user

      await CreateGlobalCart(products, purchased, store, email, tenant)

      return response.json({
        send: true
      })

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: 'internal_server_error'
      })
    }
  }
}
