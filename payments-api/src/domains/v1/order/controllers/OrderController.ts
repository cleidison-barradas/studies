import {
  Put,
  Get,
  Req,
  Res,
  Body,
  Param,
  UseBefore,
  ApiRequest,
  JsonController,
  AuthTenancyMiddleware,
} from '@mypharma/api-core'
import { Response } from 'express'
import OrderRequest from '../interfaces/IPutOrderRequest'
import {
  CreateOrder,
  UpdateOrder,
  GetOrderDetail,
  GetCustomerOrders,
  ParseProduct,
  GetPaymentMethod,
  GetCustomer,
  GetCustomerAddress,
  GetStatusOrder,
  GetDelivery,
  ProcessProduct,
  CreateStoneOrder,
  CreatePagseguroOrder,
  GetStore,
  CreatePicpayOrder,
  UpdateCartUser,
  GetCustomerCart,
  getAvailableCupom,
} from '../services/OrderService'

import { paymentCode } from '../../../../config/configPayments'
import { startOrder } from '../../../../utils/pagseguro'
import { paymentRequest } from '../../../../utils/picpay'
import notificationApi from '../../../../services/notification-api'
import sendEmail from '../../../../services/sendEmail'
import { parseTemplate } from '../../../../utils/handlebars-config'
import path = require('path')
import moment = require('moment')
import GerenciaNetService from '../../../../services/GerenciaNetService/GerenciaNetService'
import StoneService from '../../../../services/StoneService'

const { BASE_ADMIN_ORDERS } = process.env

@JsonController('/v1/order')
@UseBefore(AuthTenancyMiddleware)
export class OrderController {
  @Get('/')
  public async index(@Req() request: ApiRequest, @Res() response: Response) {
    const {
      tenant,
      session: { user },
    } = request
    let orders = []
    const result = await GetCustomerOrders(tenant, user._id)

    if (result.length <= 0) {
      return response.json({
        orders,
      })
    }

    orders = result.map((order) => {
      const { _id, products, statusOrder: orderStatus, createdAt, orderTotals } = order

      return {
        order_id: _id,
        orderProducts: products,
        orderStatus,
        orderTotals,
        date_added: createdAt,
      }
    })

    return response.json({
      orders,
    })
  }

  @Get('/detail/:orderId')
  public async detail(@Req() request: ApiRequest, @Param('orderId') orderId: string, @Res() response: Response) {
    const { tenant } = request

    const order = await GetOrderDetail(tenant, orderId)

    if (!order) {
      return response.status(404).json({
        error: 'order_not_found',
      })
    }

    const parserProductsId = order.products.map((p) => {
      const { product, unitaryValue, amount } = p

      return {
        product_id: product._id.toString(),
        name: product.name,
        ean: product.EAN,
        ms: product.MS,
        sku: product.sku ? product.sku : undefined,
        price: unitaryValue,
        quantity: amount,
        image: product.image ? product.image.key : null,
      }
    })

    return response.json({
      order: {
        order_id: order._id.toString(),
        customer: {
          firstname: order.customer.firstname,
          lastname: order.customer.lastname,
          telephone: order.customer.phone,
        },
        paymentMethod: order.paymentMethod.paymentOption.name,
        payment_custom_field: order.paymentCustomField,
        payment_method: order.paymentCode,
        payment_code: order.paymentCode,
        orderStatus: {
          name: order.statusOrder.name,
          type: order.statusOrder.type,
          order_status_id: order.statusOrder.originalId,
        },
        deliveryData: {
          deliveryFee: order.deliveryData.feePrice,
        },
        address: {
          street: order.customer.addresses[0].street,
          neighborhood: order.customer.addresses[0].neighborhood.name,
          city: order.customer.addresses[0].neighborhood.city.name,
          complement: order.customer.addresses[0].complement,
        },
        orderProducts: parserProductsId,
        orderTotals: order.orderTotals,
        extras: order.extras,
        delivery_mode: order.deliveryMode,
        shipping_order: order.shippingOrder,
        tracking_code: order.trackingCode,
      },
    })
  }

  @Put('/')
  public async put(@Req() request: ApiRequest, @Res() response: Response, @Body() body: OrderRequest) {
    const { tenant, session } = request
    const userAgent = request.get('User-Agent')
    const clientIP = request.ip
    const customerId = session.user._id

    const {
      products,
      address_id,
      payment_code,
      payment_money_change,
      payment_option_id,
      payment_custom_field,
      cpf,
      code = null,
      delivery_mode,
      shipping_order,
      health_insurance,
    } = body

    try {
      const paymentMethod = await GetPaymentMethod(tenant, payment_option_id)

      if (!paymentMethod) {
        return response.status(404).json({
          error: 'payment_method_not_found',
        })
      }

      const paymentcode = paymentCode.find((x) => x.code === payment_code)
      const customer = await GetCustomer(tenant, session.user._id)

      if (!customer) {
        return response.status(404).json({
          error: 'customer_not_found',
        })
      }
      // Clean Address in Object customer
      customer.addresses = []

      /// Customer Address
      let address = null
      address = await GetCustomerAddress(tenant, address_id)

      if (!address) {
        return response.status(404).json({
          error: 'address_not_found',
        })
      }

      // Check if mode delivey is by company
      if (address.addressType !== 'delivery_company') {
        // If address exists and delivery mode is delivery_company
        customer.addresses.push(address)
      }

      // Check if CPF has send
      if (cpf.length > 0) customer.cpf = cpf.replace(/[^0-9]/g, '')

      if (address && address.notDeliverable) {
        address.complement = 'RETIRAR NA LOJA'
      }

      if (typeof products !== 'object') {
        return response.status(404).json({
          error: 'products_invalid',
        })
      }

      const statusOrder = await GetStatusOrder()
      let initialStatus = null
      if (statusOrder.length > 0) {
        initialStatus = statusOrder.find((s) => s.type === 'pending')
      }

      const parsedProducts = await ParseProduct(tenant, products)

      const outOfStockProducts = []
      products.forEach((p) => {
        const { product_id, quantity } = p
        const outStock = parsedProducts.find(x => x.product._id.toString() === product_id.toString() && quantity > x.amount)

        if (outStock) {
          outOfStockProducts.push(outStock)
        }
      })

      if (outOfStockProducts.length > 0) {
        return response.status(400).json({
          error: 'products_out_stock',
          outOfStockProducts,
        })
      }

      let deliveryData = null
      // If delivery mode has company create address with shipping_address
      if (address.addressType === 'delivery_company') {
        customer.addresses = []
        customer.addresses.push(address)

        deliveryData = {
          freeFrom: 0,
          feePrice: Number(shipping_order.price),
        }
      }

      if (address.addressType !== 'delivery_company') {
        deliveryData = await GetDelivery(tenant, address.neighborhood._id.toString())

        if (!deliveryData) {
          return response.status(404).json({
            error: 'delivery_not_found',
          })
        }
      }

      if (address.notDeliverable && address.addressType !== 'delivery_company') {
        deliveryData.feePrice = 0.0
      }

      const cupom = await getAvailableCupom(tenant, code)

      let totalOrder = 0
      const processProducts = await ProcessProduct(products, parsedProducts, tenant, cupom)

      processProducts.forEach((p) => {
        const { amount, unitaryValue, promotionalPrice } = p
        const price = promotionalPrice < unitaryValue ? promotionalPrice : unitaryValue

        totalOrder += amount * price
      })

      const { freeFrom, feePrice } = deliveryData
      let deliveryfee = null

      if (freeFrom > 0 && totalOrder >= freeFrom && !address.notDeliverable && address.addressType !== 'delivery_company') {
        deliveryfee = 0
        deliveryData.feePrice = 0
      } else {
        deliveryfee = feePrice
      }

      const data = [
        {
          code: 'sub_total',
          title: 'Sub-total',
          value: totalOrder,
        },
        {
          code: 'shipping',
          title: 'Frete',
          value: deliveryfee,
        },
        {
          code: 'total',
          title: 'Total',
          value: totalOrder + deliveryfee,
        },
      ]

      if (deliveryfee !== null) {
        totalOrder = totalOrder + deliveryfee
      }

      let order = await CreateOrder(tenant, {
        customer,
        deliveryData,
        products: processProducts,
        clientIP,
        cpf: cpf.length > 0 ? cpf.replace(/[^0-9]/g, '') : '',
        userAgent,
        comment: '',
        paymentMethod,
        paymentCode: 'pay_on_delivery',
        prefix: 'ecommerce',
        totalOrder,
        paymentCustomField: payment_custom_field,
        statusOrder: initialStatus,
        moneyChange: payment_money_change,
        orderTotals: data as any,
        extras: [],
        healthInsurance: health_insurance,
        deliveryMode: delivery_mode || 'own_delivery',
        shippingOrder: shipping_order,
        createdAt: new Date(),
      })

      const orderId = order._id.toString()

      if (paymentcode.code === 'pagseguro') {
        const { installments, sub_method, sender_hash = null, card_token = null, card_holder } = body

        const [PagseguroEmail, PagseguroToken] = paymentMethod.extras
        try {
          const deliveryValue = deliveryfee ? deliveryfee : 0.0
          const data = await startOrder(
            order,
            customer,
            address,
            processProducts,
            deliveryValue,
            installments,
            sender_hash,
            sub_method,
            payment_option_id,
            tenant,
            PagseguroEmail.toString(),
            PagseguroToken.toString(),
            card_token,
            card_holder
          )
          await CreatePagseguroOrder(tenant, {
            order,
            pagseguroId: data.transaction.code[0],
            status: Number(data.transaction.status[0]),
            createdAt: new Date(),
          })

        } catch (error) {
          console.log(error)
          const cancelStatus = statusOrder.find((x) => x.type === 'rejected')
          order.statusOrder = cancelStatus
          order.updatedAt = new Date()

          await UpdateOrder(tenant, order)

          return response.status(500).json({
            error: 'gateway_error',
          })
        }
      }

      let picpayReturn = null
      if (paymentcode.code === 'picpay') {
        try {
          const store = await GetStore(session.store)

          if (!store) {
            return response.status(404).json({
              error: 'store_not_found',
            })
          }
          const [picpaytoken, _] = paymentMethod.extras

          picpayReturn = await paymentRequest(
            order._id.toString(),
            paymentMethod._id.toString(),
            order.totalOrder,
            order.customer,
            store.url,
            picpaytoken.toString(),
            tenant
          )

          await CreatePicpayOrder(tenant, { order, authorizationId: '', status: 'created', createdAt: new Date() })
        } catch (error) {
          console.log(error)
          const cancelStatus = statusOrder.find((x) => x.type === 'rejected')
          order.statusOrder = cancelStatus
          order.updatedAt = new Date()

          await UpdateOrder(tenant, order)

          return response.status(500).json({
            error: 'picpay_gateway_error',
          })
        }
      }

      let pixReturn
      if (paymentcode.code === 'pix') {
        try {
          const store = await GetStore(session.store)

          if (!store) {
            return response.status(404).json({
              error: 'store_not_found',
            })
          }
          const [client_id, client_secret, pix_key, certificateKey] = paymentMethod.extras

          // Instanciate our service with the credentials need for the OAuth
          const gerenciaNetService = new GerenciaNetService({ client_id, client_secret, certificateKey, pix_key } as any)

          const {
            totalOrder,
            customer: { fullName },
            _id,
          } = order

          // Create the bill document
          const bill = await gerenciaNetService.GeneratePixBilling({
            cpf: cpf.replace(/[^0-9]/g, ''),
            valor: totalOrder.toFixed(2),
            nome: fullName,
            pedido_id: _id.toString(),
          })

          // Generate the Base64 QRCode and the Link to copy and pay
          pixReturn = await gerenciaNetService.GenerateQRCode(String(bill.loc.id))

          // Push our bill document,so we can get the location and the info's later
          order.extras.push(bill)

          await UpdateOrder(tenant, order)
        } catch (error) {
          console.log(error)

          const cancelStatus = statusOrder.find((x) => x.type === 'rejected')
          order.statusOrder = cancelStatus
          order.updatedAt = new Date()

          await UpdateOrder(tenant, order)

          return response.status(500).json({
            error: 'gateway_error',
          })
        }
      }

      // Stone Crédito
      if (paymentcode.code === 'stone') {
        const { card_token, installments, cpf } = body
        const installment = installments.quantity
        const store = await GetStore(session.store)

        const stoneService = new StoneService()

        try {
          // Chama a função que cria o pedido na Stone. Além de criar o pedido lá, é capturado o hash de cobrança
          // esse hash é usado para os cancelamentos e é criado no banco stoneOrder, logo abaixo
          const hash = await stoneService.createOrder(order, store, card_token, installment, cpf)
          try {
            await CreateStoneOrder(tenant, {
              order,
              charge_id: hash,
              createdAt: new Date(),
            })
          } catch (err) {
            console.log(err)
            throw new Error()
          }
        } catch (err) {
          console.log(err)
          const cancelStatus = statusOrder.find((x) => x.type === 'rejected')
          order.statusOrder = cancelStatus
          order.updatedAt = new Date()

          await UpdateOrder(tenant, order)

          return response.status(500).json({
            error: 'ERRO NO SEU CARTÃO! CONTATE SEU BANCO',
          })
        }
      }

      // Stone Boleto
      let ticketStoneReturn
      if (paymentcode.code === 'ticket') {
        const { cpf } = body

        const store = await GetStore(session.store)
        const stoneService = new StoneService()

        try {
          const res = await stoneService.createTicketOrder(order, store, cpf)
          const hash = res.data.charges[0].id

          await CreateStoneOrder(tenant, {
            order,
            charge_id: hash,
            createdAt: new Date(),
          })

          ticketStoneReturn = {
            ticket_url: res.data.charges[0].last_transaction.url,
            ticket_barcode: res.data.charges[0].last_transaction.barcode,
            ticket_qr_code: res.data.charges[0].last_transaction.qr_code,
            ticket_line: res.data.charges[0].last_transaction.line,
            order_id: order._id,
          }
        } catch (error) {
          console.log(error)
          const cancelStatus = statusOrder.find((x) => x.type === 'rejected')
          order.statusOrder = cancelStatus
          order.updatedAt = new Date()

          delete order._id

          await UpdateOrder(tenant, order)
          return response.status(500).json({
            error: 'Erro na transação. Por favor, entre em contato com a loja.',
          })
        }
      }

      const cart = await GetCustomerCart(tenant, customerId)

      order.cupom = cupom ? cupom : null
      order.updatedAt = new Date()

      cart.cupom = null
      cart.products = []
      // cart.productsCupom = []
      cart.customerId = customerId
      delete cart._id

      await UpdateCartUser(tenant, customerId, cart)

      order = await UpdateOrder(tenant, order)

      await notificationApi.notify(orderId, session.store, tenant)

      const store = await GetStore(session.store)

      const template =
        (process.env.NODE_ENV && process.env.NODE_ENV === 'production') || process.env.NODE_ENV === 'development'
          ? path.resolve(path.join('/usr/src/app/views/emails', 'new-order-store.hbs'))
          : path.resolve(__dirname, '..', '..', '..', '..', '..', 'views', 'emails', 'new-order-store.hbs')
      await sendEmail({
        subject: `Novo Pedido #$${order._id}`,
        destination: store.settings['config_email'],
        isContentHtml: true,
        content: await parseTemplate({
          template,
          variables: {
            customer: order.customer.fullName,
            paymentMethod: order.paymentMethod.paymentOption.name,
            orderTotal: Number(order.totalOrder).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            store: store.name,
            createdAt: moment(order.createdAt).format('YYYY-MM-DD HH:mm:ss'),
            link: `${BASE_ADMIN_ORDERS}/sales/${order._id}`,
          },
        }),
      })

      const parserProductsId = order.products.map((p) => {
        const { product, unitaryValue, amount } = p

        return {
          product_id: product._id.toString(),
          ean: product.EAN,
          ms: product.MS,
          price: unitaryValue,
          quantity: amount,
          image: product.image ? product.image.key : null,
        }
      })

      return response.json({
        order: {
          order_id: order._id.toString(),
          customer: {
            firstname: order.customer.firstname,
            lastname: order.customer.lastname,
            telephone: order.customer.phone,
          },
          paymentMethod: order.paymentMethod.paymentOption.name,
          payment_custom_field: order.paymentCustomField,
          payment_method: order.paymentCode,
          payment_code: order.paymentCode,
          orderStatus: {
            name: order.statusOrder.name,
            type: order.statusOrder.type,
            order_status_id: order.statusOrder.originalId,
          },
          deliveryData: {
            deliveryFee: order.deliveryData.feePrice,
          },
          address: {
            street: address.street,
            neighborhood: address.neighborhood.name,
            city: address.neighborhood.city.name,
            complement: address.complement,
          },
          orderProducts: parserProductsId,
          total: order.orderTotals,
          picpayReturn: picpayReturn,
          extras: order.extras,
          pixReturn,
          ticketStoneReturn,
        },
      })
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: 'internal_server_error',
      })
    }
  }
}
