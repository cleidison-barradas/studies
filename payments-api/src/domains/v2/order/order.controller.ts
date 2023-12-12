/* eslint-disable @typescript-eslint/no-unused-vars */
import { Get, Req, Res, Post, Body, UseBefore, ApiRequest, JsonController, AuthTenancyMiddleware, Params, Address } from '@mypharma/api-core'
import { addSeconds } from 'date-fns'
import { Response } from 'express'
import * as moment from 'moment'

import {
  BoletoOrderDTO,
  RequestBodyMoneyOrderDTO,
  RequestBodyOnDeliveryOrderDTO,
  RequestBodyPagseguroOrderDTO,
  RequestBodyPicpayOrderDTO,
  RequestBodyPixOrderDTO,
  StoneOrderDTO,
} from './order.dto'

import CartGetService from '../cart/services/CartGetService'
import CartUpdateService from '../cart/services/CartUpdateService'

import AddressGetService from '../address/services/AddressGetByIdService'

import PaymentGetService from '../methods/services/PaymentGetByIdService'

import CustomerGetService from '../customer/services/CustomerGetByIdService'

import GerenciaNetService from '../../../services/GerenciaNetService/GerenciaNetService'

import CustomerValidateDocumentService from '../customer/services/CustomerValidateDocumentService'

import DeliveryGetService from '../delivery/services/DeliveryGetService'

import OrderGetService from './services/OrderGetService'
import OrderCreateService from './services/OrderCreateService'
import OrderUpdateService from './services/OrderUpdateService'
import OrderDeleteService from './services/OrderDeleteService'
import OrderCalculateService from './services/OrderCalculateService'
import OrderProductGetService from './services/OrderProductGetService'
import OrderCreateBasicFieldService from './services/OrderCreateBasicFieldService'
import OrdersGetByIdCustomerService from './services/OrdersGetByCustomerIdService'

import PicpayOrderCreateService from '../picpayorder/services/PicpayOrderCreateService'

import GetStatusOrderService from '../statusOrder/services/GetStatusOrderServices'

import PagseguroCreateOrderService from '../pagseguroorder/services/PagseguroCreateOrderService'
import PagseguroUpdateOrderService from '../pagseguroorder/services/PagseguroUpdateOrderService'
import ParsePagseguroStatusOrderService from '../pagseguroorder/services/ParsePagseguroStatusOrderService'
import PagseguroBuildBasicOrderFieldsService from '../pagseguroorder/services/PagseguroBuildBasicOrderFieldsService'

import EpharmaCreatePreOrder from '../epharma/services/EpharmaCreatePreOrder'
import EpharmaGetAuthorizationService from '../epharma/services/EpharmaGetAuthorizationService'
import EpharmaUpdateAuthorizationService from '../epharma/services/EpharmaUpdateAuthorizationService'
import EpharmaDeleteAuthorizationService from '../epharma/services/EpharmaDeleteAuthorizationService'

import CommentGenerateService from '../notifications/services/CommentService'
import HistoryOrderCreateService from '../historyorder/services/HistoryOrderCreateService'

import StoneCreateOrderService from '../stoneorder/services/StoneCreateOrderService'
import StoneUpdateOrderService from '../stoneorder/services/StoneUpdateOrderService'
import StoneBuildOrderDataService from '../stone/services/StoneBuildOrderDataService'

import AutomatioNotifierService from '../automation/services/AutomatioNotifierService'

import StoreGetByStoreIdService from '../store/services/StoreGetByStoreIdService'

import PaymentLinkUpdateService from './services/PaymentLinkUpdateService'

import notificationApi from '../../../services/notification-api'

import MelhorEnvioAddCartService from '../melhorenvio/services/MelhorEnvioAddCartService'

import StonePlugin from '../../../support/plugins/StonePlugin'
import PicpayPlugin from '../../../support/plugins/PicpayPlugin'
import PagseguroPlugin from '../../../support/plugins/PagseguroPlugin'
import AddressCreateService from '../address/services/AddressCreateService'
import { verifyVirtualProducts } from '../cart/helpers/verifyVirtualProducts'

@JsonController('/v2/order')
@UseBefore(AuthTenancyMiddleware)
export class OrderController {
  private cartGetService: CartGetService
  private cartUpdateService: CartUpdateService

  private addressGetService: AddressGetService
  private addressCreateService: AddressCreateService

  private paymentGetService: PaymentGetService
  private deliveryGetService: DeliveryGetService

  private paymentLinkUpdateService: PaymentLinkUpdateService

  private storeGetByStoreIdService: StoreGetByStoreIdService

  private automatioNotifierService: AutomatioNotifierService

  private customerGetService: CustomerGetService
  private customerValidateDocumentService: CustomerValidateDocumentService

  private getStatusOrderService: GetStatusOrderService
  private commentGenerateService: CommentGenerateService
  private historyOrderCreateService: HistoryOrderCreateService

  private orderGetService: OrderGetService
  private orderCreateService: OrderCreateService
  private orderUpdateService: OrderUpdateService
  private orderDeleteService: OrderDeleteService
  private orderCalculateService: OrderCalculateService
  private orderProductGetService: OrderProductGetService
  private orderCreateBasicField: OrderCreateBasicFieldService
  private ordersGetByIdCustomerService: OrdersGetByIdCustomerService

  private stoneCreateOrderService: StoneCreateOrderService
  private stoneUpdateOrderService: StoneUpdateOrderService
  private stoneBuildOrderDataService: StoneBuildOrderDataService

  private picPayOrderService: PicpayOrderCreateService
  private pagseguroUpdateService: PagseguroUpdateOrderService
  private pagseguroCreateOrderService: PagseguroCreateOrderService
  private parsePagseguroStatusOrderService: ParsePagseguroStatusOrderService
  private pagseguroBuildBasicOrderFieldsService: PagseguroBuildBasicOrderFieldsService

  private epharmaCreatePreOrder: EpharmaCreatePreOrder
  private epharmaGetAuthorizationService: EpharmaGetAuthorizationService
  private epharmaUpdateAuthorizationService: EpharmaUpdateAuthorizationService
  private epharmaDeleteAuthorizationService: EpharmaDeleteAuthorizationService

  private MelhorEnvioAddCartService: MelhorEnvioAddCartService

  constructor() {
    this.cartGetService = new CartGetService()
    this.cartUpdateService = new CartUpdateService()
    this.addressGetService = new AddressGetService()
    this.addressCreateService = new AddressCreateService()
    this.paymentGetService = new PaymentGetService()
    this.deliveryGetService = new DeliveryGetService()
    this.paymentLinkUpdateService = new PaymentLinkUpdateService()
    this.storeGetByStoreIdService = new StoreGetByStoreIdService()
    this.automatioNotifierService = new AutomatioNotifierService()

    this.customerGetService = new CustomerGetService()
    this.customerValidateDocumentService = new CustomerValidateDocumentService()

    this.getStatusOrderService = new GetStatusOrderService()
    this.commentGenerateService = new CommentGenerateService()
    this.historyOrderCreateService = new HistoryOrderCreateService()

    this.orderGetService = new OrderGetService()
    this.orderCreateService = new OrderCreateService()
    this.orderUpdateService = new OrderUpdateService()
    this.orderDeleteService = new OrderDeleteService()
    this.orderCalculateService = new OrderCalculateService()
    this.orderProductGetService = new OrderProductGetService()
    this.orderCreateBasicField = new OrderCreateBasicFieldService()
    this.ordersGetByIdCustomerService = new OrdersGetByIdCustomerService()

    this.stoneCreateOrderService = new StoneCreateOrderService()
    this.stoneUpdateOrderService = new StoneUpdateOrderService()
    this.stoneBuildOrderDataService = new StoneBuildOrderDataService()

    this.picPayOrderService = new PicpayOrderCreateService()
    this.pagseguroUpdateService = new PagseguroUpdateOrderService()
    this.pagseguroCreateOrderService = new PagseguroCreateOrderService()
    this.parsePagseguroStatusOrderService = new ParsePagseguroStatusOrderService()
    this.pagseguroBuildBasicOrderFieldsService = new PagseguroBuildBasicOrderFieldsService()

    this.MelhorEnvioAddCartService = new MelhorEnvioAddCartService()

    this.epharmaCreatePreOrder = new EpharmaCreatePreOrder()
    this.epharmaGetAuthorizationService = new EpharmaGetAuthorizationService()
    this.epharmaUpdateAuthorizationService = new EpharmaUpdateAuthorizationService()
    this.epharmaDeleteAuthorizationService = new EpharmaDeleteAuthorizationService()
  }

  @Get('/:orderId?')
  public async index(@Params() { orderId = null }: { orderId: string | null }, @Req() request: ApiRequest, @Res() response: Response) {
    try {
      const {
        tenant,
        session: { user },
      } = request

      if (!user) {
        return response.status(404).json({
          error: 'user_not_found',
        })
      }

      if (orderId) {
        const order = await this.orderGetService.execute({ tenant, orderId })

        return response.json({
          order,
        })
      }

      const orders = await this.ordersGetByIdCustomerService.getOrdersByCustomerId({ tenant, customerId: user._id })

      return response.json({
        orders,
      })
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        orders: [],
      })
    }
  }

  @Post('/money')
  public async create(@Req() request: ApiRequest, @Res() response: Response, @Body() body: RequestBodyMoneyOrderDTO) {
    try {
      const {
        tenant,
        socket,
        headers,
        session: { user, store: storeId },
      } = request
      const {
        cartId,
        addressId,
        paymentId,
        comment = '',
        authorizationId,
        moneyChange = 0,
        installedApp = false,
        deliveryMode = 'own_delivery',
        paymentCode = 'pay_on_delivery',
        storeBranchPickup,
      } = body

      const customerId = user._id.toString()

      const store = await this.storeGetByStoreIdService.getStoreById({ storeId })

      const userAgent = headers['user-agent']
      const clientIP = headers['x-forwarded-for'] || socket.remoteAddress

      if (deliveryMode === 'delivery_company') {
        return response.status(403).json({
          error: 'invalid_mode_operation',
        })
      }

      const customer = await this.customerGetService.findCustomerById({ tenant, customerId })

      const address = await this.addressGetService.findAddressById({ tenant, addressId, deliveryMode })

      const paymentMethod = await this.paymentGetService.findPaymentMethodById({ tenant, paymentId })

      const cart = await this.cartGetService.findCartById({ storeId, cartId })

      const cupom = cart.cupom || null
      const cartProducts = cart.products

      // Check if exists PBM Authorization
      const { authorization } = await this.epharmaGetAuthorizationService.getAuthorization({ authorizationId, storeId, cartProducts })
      const productAuthorized = authorization?.productAuthorized || []

      const { products, paymentLinkId } = await this.orderProductGetService.execute({
        cupom,
        tenant,
        cartId,
        cartProducts,
        productAuthorized,
      })

      const deliveryData = await this.deliveryGetService.execute({ tenant, address, deliveryMode, products, paymentLinkId, store })

      const totalOrder = this.orderCalculateService.execute({ products, deliveryData })

      const statusData = await this.getStatusOrderService.execute({})

      const statusOrder = statusData.find((status) => status.type.includes('pending'))

      let order = this.orderCreateBasicField.execute({
        tenant,
        comment,
        address,
        customer,
        products,
        clientIP,
        userAgent,
        totalOrder,
        paymentCode,
        moneyChange,
        statusOrder,
        deliveryMode,
        deliveryData,
        paymentMethod,
        installedApp,
        paymentLinkId,
        storeBranchPickup,
      })

      order = await this.orderCreateService.execute({ tenant, order })
      const orderId = order._id.toString()

      // update order fields
      order.cupom = cupom

      // update cart
      cart.cupom = null
      cart.products = []
      cart.purchased = 'YES'
      cart.customerId = customerId

      await this.cartUpdateService.execute({ storeId, cartId, cart })

      order = await this.orderUpdateService.execute({ tenant, order, orderId })

      await this.epharmaCreatePreOrder.createPreOrder({ storeId, orderId, authorization })

      // If has authorization PBM reset authorization
      await this.epharmaDeleteAuthorizationService.deleteAuthorization({ authorizationId: authorization?._id.toString() })

      if (paymentLinkId) await this.paymentLinkUpdateService.deletePaymentLink({ tenant, paymentLinkId })

      //await notificationApi.notify(orderId, storeId, tenant)

      await this.automatioNotifierService.notifierAutomation({ order, store })

      return response.json({
        order,
      })
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: error.message,
      })
    }
  }

  @Post('/onDelivery')
  public async onDelivery(@Req() request: ApiRequest, @Res() response: Response, @Body() body: RequestBodyOnDeliveryOrderDTO) {
    try {
      const {
        tenant,
        socket,
        headers,
        session: { user, store: storeId },
      } = request
      const {
        cartId,
        addressId,
        paymentId,
        comment = '',
        authorizationId,
        installedApp = false,
        healthInsurance = '',
        deliveryMode = 'own_delivery',
        paymentCode = 'pay_on_delivery',
        payment_installments = 1,
        storeBranchPickup,
      } = body
      const customerId = user._id.toString()

      const userAgent = headers['user-agent']
      const clientIP = headers['x-forwarded-for'] || socket.remoteAddress

      if (deliveryMode === 'delivery_company') {
        return response.status(403).json({
          error: 'invalid_mode_operation',
        })
      }

      const selectedInstallment = {
        quantity: payment_installments,
        hasFee: false
      }

      const store = await this.storeGetByStoreIdService.getStoreById({ storeId })

      const customer = await this.customerGetService.findCustomerById({ tenant, customerId })

      const address = await this.addressGetService.findAddressById({ tenant, addressId, deliveryMode })

      const paymentMethod = await this.paymentGetService.findPaymentMethodById({ tenant, paymentId })

      const cart = await this.cartGetService.findCartById({ storeId, cartId })

      const cupom = cart.cupom || null
      const cartProducts = cart.products

      // Check if exists PBM Authorization
      const { authorization } = await this.epharmaGetAuthorizationService.getAuthorization({ authorizationId, storeId, cartProducts })

      const productAuthorized = authorization?.productAuthorized || []

      const { products, paymentLinkId } = await this.orderProductGetService.execute({
        cupom,
        tenant,
        cartId,
        cartProducts,
        productAuthorized,
      })

      const deliveryData = await this.deliveryGetService.execute({
        tenant,
        address,
        products,
        deliveryMode,
        paymentLinkId,
        store,
      })

      const totalOrder = this.orderCalculateService.execute({ products, deliveryData })

      const statusData = await this.getStatusOrderService.execute({})

      const statusOrder = statusData.find((status) => status.type.includes('pending'))

      let order = this.orderCreateBasicField.execute({
        tenant,
        comment,
        address,
        customer,
        products,
        clientIP,
        userAgent,
        totalOrder,
        paymentCode,
        statusOrder,
        deliveryMode,
        deliveryData,
        paymentMethod,
        installedApp,
        selectedInstallment,
        healthInsurance,
        storeBranchPickup,
      })

      order = await this.orderCreateService.execute({ tenant, order })
      const orderId = order._id.toString()

      // update order fields
      order.cupom = cupom
      // update cart
      cart.cupom = null
      cart.products = []
      cart.purchased = 'YES'
      cart.customerId = customerId

      await this.cartUpdateService.execute({ storeId, cartId, cart })

      order = await this.orderUpdateService.execute({ tenant, order, orderId })

      await this.epharmaCreatePreOrder.createPreOrder({ storeId, orderId, authorization })

      // If has authorization PBM reset authorization
      await this.epharmaDeleteAuthorizationService.deleteAuthorization({ authorizationId: authorization?._id.toString() })

      if (paymentLinkId) await this.paymentLinkUpdateService.deletePaymentLink({ tenant, paymentLinkId })

      //await notificationApi.notify(orderId, storeId, tenant)

      await this.automatioNotifierService.notifierAutomation({ order, store })

      return response.json({
        order,
      })
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: 'internal_server_error',
      })
    }
  }

  @Post('/picpay')
  public async createPicpayOrder(@Req() request: ApiRequest, @Res() response: Response, @Body() body: RequestBodyPicpayOrderDTO) {
    try {
      const {
        tenant,
        socket,
        headers,
        session: { user, store: storeId },
      } = request

      const {
        cartId,
        sender,
        cpf = '',
        paymentId,
        addressId,
        comment = '',
        shipping = null,
        authorizationId,
        installedApp = false,
        deliveryMode = 'own_delivery',
        paymentCode = 'pay_on_delivery',
        storeBranchPickup,
      } = body

      const customerId = user._id.toString()

      const userAgent = headers['user-agent']
      const clientIP = headers['x-forwarded-for'] || socket.remoteAddress

      const store = await this.storeGetByStoreIdService.getStoreById({ storeId })

      const customer = await this.customerGetService.findCustomerById({ tenant, customerId })

      const document = this.customerValidateDocumentService.validateCustomerDocument({ cpf, customer })

      const address = await this.addressGetService.findAddressById({ tenant, addressId, deliveryMode })

      const paymentMethod = await this.paymentGetService.findPaymentMethodById({ tenant, paymentId })

      const [token, seller_token] = paymentMethod.extras

      if (!token || !seller_token) {
        return response.status(404).json({
          error: 'payment_method_not_elegible',
        })
      }

      const cart = await this.cartGetService.findCartById({ storeId, cartId })

      const cupom = cart.cupom || null
      const cartProducts = cart.products

      // Check if exists PBM Authorization
      const { authorization } = await this.epharmaGetAuthorizationService.getAuthorization({ authorizationId, storeId, cartProducts })

      const productAuthorized = authorization?.productAuthorized || []

      const { products, paymentLinkId } = await this.orderProductGetService.execute({
        cupom,
        tenant,
        cartId,
        cartProducts,
        productAuthorized,
      })

      const deliveryData = await this.deliveryGetService.execute({ tenant, address, deliveryMode, products, shipping, paymentLinkId, store })

      const totalOrder = this.orderCalculateService.execute({ products, deliveryData })

      const statusData = await this.getStatusOrderService.execute({})

      const statusOrder = statusData.find((status) => status.type.includes('pending'))

      let order = this.orderCreateBasicField.execute({
        tenant,
        comment,
        address,
        customer,
        products,
        clientIP,
        userAgent,
        totalOrder,
        paymentCode,
        statusOrder,
        deliveryMode,
        deliveryData,
        paymentMethod,
        installedApp,
        storeBranchPickup,
      })

      order = await this.orderCreateService.execute({ tenant, order })

      const picpayOrder = await this.picPayOrderService.execute({ tenant, order })

      const picpay_token = String(token)
      const orderId = order._id.toString()
      const referenceId = picpayOrder._id.toString()

      const picpayPlugin = new PicpayPlugin()

      try {
        const { data: picPayTransaction } = await picpayPlugin.paymentRequest({ order, picpay_token, tenant, referenceId, document })

        const melhorEnvioCartResponse = await this.MelhorEnvioAddCartService.addMelhorEnvioCart({ order, store, sender, shipping })

        // update order fields
        order.cupom = cupom
        order.shippingOrder = shipping
        order.extras = [picPayTransaction]
        order.tagCode = melhorEnvioCartResponse ? melhorEnvioCartResponse.protocol : null

        // update cart
        cart.cupom = null
        cart.products = []
        cart.purchased = 'YES'
        cart.customerId = customerId

        await this.cartUpdateService.execute({ storeId, cartId, cart })

        order = await this.orderUpdateService.execute({ tenant, order, orderId })

        await this.epharmaCreatePreOrder.createPreOrder({ storeId, orderId, authorization })

        // If has authorization PBM reset authorization
        await this.epharmaDeleteAuthorizationService.deleteAuthorization({ authorizationId: authorization?._id.toString() })

        if (paymentLinkId) await this.paymentLinkUpdateService.deletePaymentLink({ tenant, paymentLinkId })

        //await notificationApi.notify(orderId, storeId, tenant)

        await this.automatioNotifierService.notifierAutomation({ order, store })

        return response.json({
          order,
          picPayTransaction,
        })
      } catch (error) {
        console.log(error)

        await picpayPlugin.paymentCancel({ referenceId, picpay_token })

        await this.orderDeleteService.execute({ tenant, orderId })

        return response.status(500).json({
          error: 'picpay_gateway_error',
        })
      }
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: error.message,
      })
    }
  }

  @Post('/pix')
  public async createPixOrder(@Req() request: ApiRequest, @Res() response: Response, @Body() body: RequestBodyPixOrderDTO) {
    const {
      tenant,
      socket,
      headers,
      session: { user, store: storeId },
    } = request
    const {
      cartId,
      sender,
      cpf = '',
      addressId,
      paymentId,
      comment = '',
      shipping = null,
      authorizationId,
      deliveryMode = 'own_delivery',
      paymentCode = 'pay_on_delivery',
      storeBranchPickup,
    } = body
    const customerId = user._id.toString()

    const userAgent = headers['user-agent']
    const clientIP = headers['x-forwarded-for'] || socket.remoteAddress

    const store = await this.storeGetByStoreIdService.getStoreById({ storeId })

    const customer = await this.customerGetService.findCustomerById({ tenant, customerId })

    const document = this.customerValidateDocumentService.validateCustomerDocument({ cpf, customer })

    const address = await this.addressGetService.findAddressById({ tenant, addressId, deliveryMode })

    const paymentMethod = await this.paymentGetService.findPaymentMethodById({ tenant, paymentId })

    const { GERENCIANET_PARTNER_TOKEN } = process.env

    const [clientId, clientSecret, pixKey, certificate_key] = paymentMethod.extras

    if (!clientId || !clientSecret || !pixKey || !certificate_key) {
      return response.status(404).json({
        error: 'payment_method_not_elegible',
      })
    }

    const cart = await this.cartGetService.findCartById({ storeId, cartId })

    const cupom = cart.cupom || null
    const cartProducts = cart.products

    // Check if exists PBM Authorization
    const { authorization } = await this.epharmaGetAuthorizationService.getAuthorization({ authorizationId, storeId, cartProducts })

    const productAuthorized = authorization?.productAuthorized || []

    const { products, paymentLinkId } = await this.orderProductGetService.execute({
      tenant,
      cupom,
      cartId,
      cartProducts,
      productAuthorized,
    })

    const deliveryData = await this.deliveryGetService.execute({ tenant, address, deliveryMode, products, shipping, paymentLinkId, store })

    const totalOrder = this.orderCalculateService.execute({ products, deliveryData })

    const statusData = await this.getStatusOrderService.execute({})

    const statusOrder = statusData.find((status) => status.type.includes('pending'))

    let order = this.orderCreateBasicField.execute({
      tenant,
      comment,
      address,
      customer,
      products,
      clientIP,
      userAgent,
      totalOrder,
      paymentCode,
      statusOrder,
      deliveryMode,
      deliveryData,
      paymentMethod,
      storeBranchPickup,
    })

    order = await this.orderCreateService.execute({ tenant, order })
    const orderId = order._id.toString()

    try {
      const pix_key = String(pixKey)
      const client_id = String(clientId)
      const client_secret = String(clientSecret)
      const certificateKey = String(certificate_key)
      const partner_token = String(GERENCIANET_PARTNER_TOKEN)

      const gerenciaNetService = new GerenciaNetService({ client_id, client_secret, certificateKey, pix_key, partner_token })

      const bill = await gerenciaNetService.GeneratePixBilling({
        cpf: document,
        valor: totalOrder.toFixed(2),
        nome: customer.fullName,
        pedido_id: order._id.toString(),
      })
      // Generate the Base64 QRCode and the Link to copy and pay
      const pixTransaction = await gerenciaNetService.GenerateQRCode(String(bill.loc.id))
      const { imagemQrcode, qrcode } = pixTransaction
      const expiresAt = addSeconds(new Date(bill.calendario.criacao), bill.calendario.expiracao)

      const melhorEnvioCartResponse = await this.MelhorEnvioAddCartService.addMelhorEnvioCart({ order, store, sender, shipping })

      // Push our bill document,so we can get the location and the info's later
      // update order fields
      order.extras = []
      order.cupom = cupom
      order.shippingOrder = shipping
      order.tagCode = melhorEnvioCartResponse ? melhorEnvioCartResponse.protocol : null

      order.extras.push({
        bill,
        qrcode,
        expiresAt,
        imagemQrcode
      })

      // update cart
      cart.cupom = null
      cart.products = []
      cart.purchased = 'YES'
      cart.customerId = customerId

      await this.cartUpdateService.execute({ storeId, cartId, cart })

      order = await this.orderUpdateService.execute({ tenant, order, orderId })

      await this.epharmaCreatePreOrder.createPreOrder({ storeId, orderId, authorization })

      // If has authorization PBM reset authorization
      await this.epharmaDeleteAuthorizationService.deleteAuthorization({ authorizationId: authorization?._id.toString() })

      if (paymentLinkId) await this.paymentLinkUpdateService.deletePaymentLink({ tenant, paymentLinkId })

      //await notificationApi.notify(orderId, storeId, tenant)

      await this.automatioNotifierService.notifierAutomation({ order, store })

      return response.json({
        order,
        pixTransaction,
      })
    } catch (error) {
      console.log(error)

      return response.status(500).json({
        error: 'pix_gateway_error',
      })
    }
  }

  @Post('/pagseguro')
  public async createPagseguroOrder(@Req() request: ApiRequest, @Res() response: Response, @Body() body: RequestBodyPagseguroOrderDTO) {
    try {
      const {
        tenant,
        socket,
        headers,
        session: { user, store: storeId },
      } = request
      const {
        cpf = '',
        cartId,
        sender,
        addressId,
        paymentId,
        comment = '',
        card_name,
        card_token,
        sender_hash,
        installment,
        authorizationId,
        shipping = null,
        installedApp = false,
        deliveryMode = 'own_delivery',
        paymentCode = 'pay_on_delivery',
        storeBranchPickup,
      } = body

      const userAgent = headers['user-agent']
      const clientIP = headers['x-forwarded-for'] || socket.remoteAddress

      const customerId = user._id.toString()

      const store = await this.storeGetByStoreIdService.getStoreById({ storeId })

      const customer = await this.customerGetService.findCustomerById({ tenant, customerId })

      const document = this.customerValidateDocumentService.validateCustomerDocument({ cpf, customer })

      const address = await this.addressGetService.findAddressById({ tenant, addressId, deliveryMode })

      const paymentMethod = await this.paymentGetService.findPaymentMethodById({ tenant, paymentId })

      const [pagseguro_email, pagseguro_token] = paymentMethod.extras

      if (!pagseguro_email || !pagseguro_token) {
        throw new Error('payment_method_not_elegible')
      }

      const cart = await this.cartGetService.findCartById({ storeId, cartId })

      const cupom = cart.cupom || null
      const cartProducts = cart.products

      // Check if exists PBM Authorization
      const { authorization } = await this.epharmaGetAuthorizationService.getAuthorization({ authorizationId, storeId, cartProducts })

      const productAuthorized = authorization?.productAuthorized || []

      const { products, paymentLinkId } = await this.orderProductGetService.execute({
        cupom,
        cartId,
        tenant,
        cartProducts,
        productAuthorized,
      })

      const deliveryData = await this.deliveryGetService.execute({ tenant, address, deliveryMode, products, shipping, paymentLinkId, store })

      const totalOrder = this.orderCalculateService.execute({ products, deliveryData })

      let statusOrder = await this.getStatusOrderService.execute({ type: ['pending'] })

      let order = this.orderCreateBasicField.execute({
        tenant,
        comment,
        address,
        customer,
        products,
        clientIP,
        userAgent,
        totalOrder,
        paymentCode,
        statusOrder: statusOrder[0],
        deliveryMode,
        deliveryData,
        paymentMethod,
        installedApp,
      })

      order = await this.orderCreateService.execute({ tenant, order })
      const orderId = order._id.toString()

      let pagseguroOrder = this.pagseguroBuildBasicOrderFieldsService.generatePagseguroBasicOrderFields({
        order,
        status: 1,
      })

      pagseguroOrder = await this.pagseguroCreateOrderService.execute({ tenant, pagseguroOrder })

      const pagseguroEmail = String(pagseguro_email)
      const pagseguroToken = String(pagseguro_token)
      const referenceId = pagseguroOrder._id.toString()

      const pagSeguroPlugin = new PagseguroPlugin({ pagseguroEmail, pagseguroToken })

      try {
        const { transaction } = await pagSeguroPlugin.requestPayment({
          card_cpf: document,
          card_name,
          card_token,
          sender_hash,
          installment,
          order,
          tenant,
          paymentId,
          referenceId,
        })
        // Get pagseguro transaction code case any process failure to cancel payment
        pagseguroOrder.pagseguroId = transaction.code[0]
        // Create shipping label
        const melhorEnvioCartResponse = await this.MelhorEnvioAddCartService.addMelhorEnvioCart({ order, store, sender, shipping })

        const status = this.parsePagseguroStatusOrderService.parseStatusOrder({ status: Number(transaction.status[0]) })

        statusOrder = await this.getStatusOrderService.execute({ type: [status] })
        // update cart
        cart.cupom = null
        cart.products = []
        cart.purchased = 'YES'
        cart.customerId = customer._id.toString()

        await this.cartUpdateService.execute({ storeId, cartId, cart })

        // update order
        order.extras = []
        order.cupom = cupom
        order.shippingOrder = shipping
        order.statusOrder = statusOrder[0]
        order.tagCode = melhorEnvioCartResponse ? melhorEnvioCartResponse.protocol : null

        order = await this.orderUpdateService.execute({ tenant, order, orderId })

        await this.epharmaCreatePreOrder.createPreOrder({ storeId, orderId, authorization })

        // If has authorization PBM reset authorization
        await this.epharmaDeleteAuthorizationService.deleteAuthorization({ authorizationId: authorization?._id.toString() })

        // update pagseguroOrder
        pagseguroOrder.order = order
        pagseguroOrder.status = Number(transaction.status[0])

        pagseguroOrder = await this.pagseguroUpdateService.execute({ tenant, order: pagseguroOrder })

        const comments = this.commentGenerateService.generateComments({ status: statusOrder[0].type })

        await this.historyOrderCreateService.execute({ tenant, order, comments, statusOrder: statusOrder[0] })

        if (paymentLinkId) await this.paymentLinkUpdateService.deletePaymentLink({ tenant, paymentLinkId })

        //await notificationApi.notify(orderId, storeId, tenant)

        await this.automatioNotifierService.notifierAutomation({ order, store })

        return response.json({
          order,
          transaction,
        })
      } catch (error) {
        console.log(error)
        await pagSeguroPlugin.cancelPayment({ transactionCode: pagseguroOrder.pagseguroId })

        await this.orderDeleteService.execute({ tenant, orderId })

        return response.status(500).json({
          error: 'pagseguro_gateway_error',
        })
      }
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: 'internal_server_error',
      })
    }
  }

  @Post('/stone')
  public async createStoneOrder(@Req() request: ApiRequest, @Res() response: Response, @Body() body: StoneOrderDTO) {
    try {
      const {
        cartId,
        sender,
        cpf = '',
        addressId,
        paymentId,
        card_token,
        comment = '',
        installments: selectedInstallment,
        authorizationId,
        shipping = null,
        installedApp = false,
        deliveryMode = 'own_delivery',
        paymentCode = 'pay_on_delivery',
        address = null,
        storeBranchPickup,
      } = body

      const {
        tenant,
        socket,
        headers,
        session: { user, store: storeId },
      } = request

      const customerId = user._id.toString()

      const userAgent = headers['user-agent']
      const clientIP = headers['x-forwarded-for'] || socket.remoteAddress

      const store = await this.storeGetByStoreIdService.getStoreById({ storeId })

      const customer = await this.customerGetService.findCustomerById({ tenant, customerId })
      const document = this.customerValidateDocumentService.validateCustomerDocument({ cpf, customer })

      const _address = (
        addressId
          ? await this.addressGetService.findAddressById({ tenant, addressId, deliveryMode })
          : await this.addressCreateService.execute({ tenant, address, customerId })
      ) as Address

      const paymentMethod = await this.paymentGetService.findPaymentMethodById({ tenant, paymentId })

      const [secret_key, public_key] = paymentMethod.extras

      if (!secret_key || !public_key) {
        return response.status(404).json({
          error: 'payment_method_not_elegible',
        })
      }
      const cart = await this.cartGetService.findCartById({ storeId, cartId })
      const cupom = cart.cupom || null
      const cartProducts = cart.products

      const { onlyVirtualProducts, hasVirtualProducts } = verifyVirtualProducts(cartProducts)

      const { authorization } = await this.epharmaGetAuthorizationService.getAuthorization({ authorizationId, storeId, cartProducts })

      const productAuthorized = authorization?.productAuthorized || []

      const { products, paymentLinkId } = await this.orderProductGetService.execute({
        cupom,
        cartId,
        tenant,
        cartProducts,
        productAuthorized,
      })

      const deliveryData = await this.deliveryGetService.execute({
        tenant,
        address: _address,
        deliveryMode,
        products,
        shipping,
        paymentLinkId,
        paymentMethod: 'stone',
        store,
      })

      const totalOrder = this.orderCalculateService.execute({ products, deliveryData })

      const statusData = await this.getStatusOrderService.execute({})

      const statusOrder = statusData.find((status) => status.type.includes('pending'))

      let order = this.orderCreateBasicField.execute({
        tenant,
        comment,
        address: _address,
        customer,
        products,
        clientIP,
        userAgent,
        totalOrder,
        paymentCode,
        statusOrder,
        deliveryMode,
        deliveryData,
        paymentMethod,
        installedApp,
        paymentGateway: 'stone',
        storeBranchPickup,
        selectedInstallment
      })

      order = await this.orderCreateService.execute({ tenant, order })

      const orderId = order._id.toString()

      const stoneOrder = await this.stoneCreateOrderService.createStoneOrder({ tenant, order })
      const originalId = store.originalId

      try {
        const secretKey = String(secret_key)
        const publicKey = String(public_key)
        const statement_descriptor = store.tenant
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-zA-Z0-9 ]/g, '')
          .substring(0, 21)

        const stonePlugin = new StonePlugin({ secretKey, publicKey })

        stonePlugin.authenticate()

        const form = await this.stoneBuildOrderDataService.buildOrderFields({
          cpf: document,
          customer,
          products,
          totalOrder: selectedInstallment.total,
          deliveryData,
          payment_method: 'credit_card',
          credit_card: {
            recurrence: false,
            statement_descriptor,
            installments: selectedInstallment.quantity,
            operation_type: 'auth_and_capture',
            card: {
              token: card_token,
            },
          },
          originalId,
          selectedInstallment
        })

        const { data: stoneResponseOrder } = await stonePlugin.requestCreateOrder({ order: form })

        const melhorEnvioCartResponse = await this.MelhorEnvioAddCartService.addMelhorEnvioCart({ order, store, sender, shipping })

        order.extras = []
        order.cupom = cupom
        order.shippingOrder = shipping
        order.tagCode = melhorEnvioCartResponse ? melhorEnvioCartResponse.protocol : null

        const charge_id = stoneResponseOrder.charges[0].id

        cart.cupom = null
        cart.products = []
        cart.purchased = 'YES'
        cart.customerId = customer._id.toString()
        stoneOrder.charge_id = charge_id
        await this.cartUpdateService.execute({ storeId, cartId, cart })

        /*
        * Validation of Docas Products and separation of orders is made here.
        **/
        if (hasVirtualProducts) {
          let virtualOrder = Object.assign({}, order)
          virtualOrder.stock = 'virtual'
          virtualOrder.products = []
          order.products.forEach((p, index) => {
            if (p.product.updateOrigin === 'Docas') {
              virtualOrder.products.push(p)
              order.products.splice(index, 1)
            }
          })
          if (!shipping) {
            const [vDeliveryData, oDeliveryData] = await Promise.all([
              this.deliveryGetService.execute({
                tenant,
                address: _address,
                deliveryMode,
                products: virtualOrder.products,
                shipping,
                paymentLinkId,
                paymentMethod: 'stone',
                store,
              }),
              this.deliveryGetService.execute({
                tenant,
                address: _address,
                deliveryMode,
                products: order.products,
                shipping,
                paymentLinkId,
                paymentMethod: 'stone',
                store,
              })
            ])
            order.deliveryData = oDeliveryData
            virtualOrder.deliveryData = vDeliveryData
          }
          order.totalOrder = this.orderCalculateService.execute({ products: order.products, deliveryData })
          virtualOrder.totalOrder = this.orderCalculateService.execute({ products: virtualOrder.products, deliveryData })
          virtualOrder.relatedOrderId = order._id
          delete virtualOrder._id
          virtualOrder = await this.orderCreateService.execute({ tenant, order: virtualOrder })
          order.relatedOrderId = virtualOrder._id
        } else if (onlyVirtualProducts) {
          order.stock = 'virtual'
        }

        order = await this.orderUpdateService.execute({ tenant, order, orderId })

        await this.epharmaCreatePreOrder.createPreOrder({ storeId, orderId, authorization })

        await this.epharmaDeleteAuthorizationService.deleteAuthorization({ authorizationId: authorization?._id.toString() })

        await this.stoneUpdateOrderService.updateStoneOrder({ tenant, stoneOrder, order })

        if (paymentLinkId) await this.paymentLinkUpdateService.deletePaymentLink({ tenant, paymentLinkId })

        //await notificationApi.notify(orderId, storeId, tenant)

        await this.automatioNotifierService.notifierAutomation({ order, store })

        return response.json({
          order,
        })
      } catch (error: any) {
        console.log(error)

        return response.status(500).json({
          error: 'stone_gateway_error',
        })
      }
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error,
      })
    }
  }

  @Post('/boleto')
  public async createBoletoOrder(@Req() request: ApiRequest, @Res() response: Response, @Body() body: BoletoOrderDTO) {
    try {
      const {
        tenant,
        socket,
        headers,
        session: { user, store: storeId },
      } = request

      const {
        cartId,
        sender,
        cpf = '',
        addressId,
        paymentId,
        comment = '',
        authorizationId,
        shipping = null,
        deliveryMode = 'own_delivery',
        paymentCode = 'pay_on_delivery',
      } = body

      const userAgent = headers['user-agent']
      const clientIP = headers['x-forwarded-for'] || socket.remoteAddress

      const customerId = user._id.toString()

      const store = await this.storeGetByStoreIdService.getStoreById({ storeId })

      const customer = await this.customerGetService.findCustomerById({ tenant, customerId })

      const document = this.customerValidateDocumentService.validateCustomerDocument({ cpf, customer })

      const address = await this.addressGetService.findAddressById({ tenant, addressId, deliveryMode })

      const paymentMethod = await this.paymentGetService.findPaymentMethodById({ tenant, paymentId })

      const [secret_key, public_key] = paymentMethod.extras

      if (!secret_key || !public_key) {
        return response.status(404).json({
          error: 'payment_method_not_elegible',
        })
      }

      const cart = await this.cartGetService.findCartById({ storeId, cartId })

      const cupom = cart.cupom || null
      const cartProducts = cart.products

      // Check if exists PBM Authorization
      const { authorization } = await this.epharmaGetAuthorizationService.getAuthorization({ authorizationId, storeId, cartProducts })

      const productAuthorized = authorization?.productAuthorized || []

      const { products, paymentLinkId } = await this.orderProductGetService.execute({
        cupom,
        cartId,
        tenant,
        cartProducts,
        productAuthorized,
      })

      const deliveryData = await this.deliveryGetService.execute({ tenant, address, deliveryMode, products, shipping, paymentLinkId, store })

      const totalOrder = this.orderCalculateService.execute({ products, deliveryData })

      const statusData = await this.getStatusOrderService.execute({})

      const statusOrder = statusData.find((status) => status.type.includes('pending'))

      let order = this.orderCreateBasicField.execute({
        tenant,
        comment,
        address,
        customer,
        products,
        clientIP,
        userAgent,
        totalOrder,
        paymentCode,
        statusOrder,
        deliveryMode,
        deliveryData,
        paymentMethod,
      })

      order = await this.orderCreateService.execute({ tenant, order })
      const orderId = order._id.toString()
      const originalId = store.originalId

      const stoneOrder = await this.stoneCreateOrderService.createStoneOrder({ tenant, order })

      try {
        const secretKey = String(secret_key)
        const publicKey = String(public_key)

        const stonePlugin = new StonePlugin({ secretKey, publicKey })

        stonePlugin.authenticate()

        const form = await this.stoneBuildOrderDataService.buildOrderFields({
          cpf: document,
          customer,
          products,
          totalOrder,
          deliveryData,
          payment_method: 'boleto',
          boleto: {
            type: 'DM',
            bank: '237',
            due_at: moment().add(3, 'd').toDate(),
            instructions: 'Pagar até vencimento',
          },
          originalId,
        })

        const { data: stoneResponseOrder } = await stonePlugin.requestCreateOrder({ order: form })

        const melhorEnvioCartResponse = await this.MelhorEnvioAddCartService.addMelhorEnvioCart({ order, store, sender, shipping })

        const { url, barcode, qr_code, line } = stoneResponseOrder.charges[0].last_transaction
        const charge_id = stoneResponseOrder.charges[0].id
        // update cart
        order.cupom = cupom
        order.shippingOrder = shipping

        cart.cupom = null
        cart.products = []
        cart.purchased = 'YES'
        cart.customerId = customerId

        order.extras = []
        order.extras.push(url as any, barcode as any, qr_code as any, line as any)
        order.tagCode = melhorEnvioCartResponse ? melhorEnvioCartResponse.protocol : null

        stoneOrder.charge_id = charge_id
        await this.cartUpdateService.execute({ storeId, cartId, cart })

        order = await this.orderUpdateService.execute({ tenant, order, orderId })

        await this.epharmaCreatePreOrder.createPreOrder({ storeId, orderId, authorization })

        // If has authorization PBM reset authorization
        await this.epharmaDeleteAuthorizationService.deleteAuthorization({ authorizationId: authorization?._id.toString() })

        await this.stoneUpdateOrderService.updateStoneOrder({ tenant, stoneOrder, order })

        if (paymentLinkId) await this.paymentLinkUpdateService.deletePaymentLink({ tenant, paymentLinkId })

        //await notificationApi.notify(orderId, storeId, tenant)

        await this.automatioNotifierService.notifierAutomation({ order, store })

        return response.json({
          order,
        })
      } catch (error) {
        console.log(error)

        return response.status(500).json({
          error: 'stone_tiket_error',
        })
      }
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error,
      })
    }
  }
}
