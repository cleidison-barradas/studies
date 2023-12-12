import { CartProductRequest, Cupom, OrderProducts, PaymentLinkRepository } from '@mypharma/api-core'
import { ProductCupomDiscount } from '../../products/helpers/ProductCupomDiscount'

import ProductGetService from '../../products/services/ProductGetService'
import { AuthorizedTransactionItems } from '../order.dto'
import { getProductSlowerSpecialPrice } from '../../products/helpers/ProductMinimumSpecialPrice'
import VirtualProductGetService from '../../products/services/VirtualProductGetService'

interface RequestOrderProductGetServiceDTO {
  tenant: string
  cupom?: Cupom
  cartId?: string
  cartProducts: CartProductRequest[]
  productAuthorized?: AuthorizedTransactionItems[]
}

class OrderProductGetService {
  private productGetService: ProductGetService
  private virtualProductGetService: VirtualProductGetService

  constructor() {
    this.productGetService = new ProductGetService()
    this.virtualProductGetService = new VirtualProductGetService()
  }

  getPaymentLinkFromCart(tenant: string, cartId: string) {
    return PaymentLinkRepository.repo(tenant).findOne({
      cartId: cartId,
    })
  }

  public async execute({ tenant, cartProducts, cupom = null, cartId = null, productAuthorized = [] }: RequestOrderProductGetServiceDTO) {
    const orderProducts: OrderProducts[] = []

    if (cartProducts.length <= 0) {
      throw new Error('cart_products_invalid')
    }

    const productIds: string[] = []
    const virtualIds: string[] = []

    for (const p of cartProducts) {
      if (p.product.updateOrigin === 'Docas') {
        virtualIds.push(p.product._id.toString())
      } else {
        productIds.push(p.product._id.toString())
      }
    }

    const physicalProducts = await this.productGetService.execute({ tenant, productIds })
    const virtualProducts = await this.virtualProductGetService.execute({ tenant, virtualIds })

    if (physicalProducts.length < productIds.length || virtualProducts.length < virtualIds.length) {
      throw new Error('cart_products_invalid')
    }

    const paymentLink = await this.getPaymentLinkFromCart(tenant, cartId)

    cartProducts.forEach(cartProduct => {
      const origin = cartProduct.origin || 'showcase'

      let product = (cartProduct.product.updateOrigin === 'Docas' ? virtualProducts : physicalProducts).find(_product => _product._id.toString() === cartProduct.product._id.toString())

      if (!product) {
        throw new Error('product_array_invalid')
      }

      // Get quantity from product on cart 
      const amount = cartProduct.quantity

      // Get product instance from cart if payment link
      product = paymentLink ? cartProduct.product : product

      // Get PBM discount if has product authorized
      const authorizedProduct = productAuthorized.find(authorized => authorized.ean === product.EAN)

      const unitaryValue = product.price
      let promotionalPrice = product.price

      if (!paymentLink) {
        // Get slower product price
        const specialPrice = getProductSlowerSpecialPrice(product, authorizedProduct?.salePrice)

        promotionalPrice = specialPrice ? specialPrice : promotionalPrice

        product.price = promotionalPrice
      }

      // Get dicount value
      const cupomDiscount = ProductCupomDiscount(product, cupom)

      if (cupomDiscount) {

        promotionalPrice = cupomDiscount
      }

      orderProducts.push({
        origin,
        amount,
        product,
        unitaryValue,
        promotionalPrice,
      })
    })

    return {
      products: orderProducts,
      paymentLinkId: paymentLink?._id,
    }
  }
}

export default OrderProductGetService
