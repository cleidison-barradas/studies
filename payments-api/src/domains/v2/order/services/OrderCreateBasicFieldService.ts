import { Address, DeliveryFee, Order, ObjectID, DistanceDeliveryFee, StoreBranchPickup } from '@mypharma/api-core'
import { IOrderBasicFields } from '../interfaces/order'

interface SelectedInstallment {
  quantity: number
  hasFee: boolean
  feeValue?: number
}

interface RequestOrderCreateBasicFieldService extends IOrderBasicFields {
  comment?: string
  address?: Address
  clientIP: string | string[]
  userAgent: string
  totalOrder: number
  moneyChange?: number
  healthInsurance?: string
  deliveryData?: DeliveryFee | DistanceDeliveryFee
  installedApp?: boolean
  paymentLinkId?: ObjectID | undefined
  paymentGateway?: string
  storeBranchPickup?: StoreBranchPickup
  selectedInstallment?: SelectedInstallment
}

class OrderCreateBasicFieldService {
  public execute({
    customer,
    paymentMethod,
    products = [],
    deliveryMode = 'own_delivery',
    paymentCode = 'pay_on_delivery',
    deliveryData = null,
    address = null,
    healthInsurance,
    moneyChange,
    statusOrder,
    comment,
    totalOrder,
    userAgent,
    clientIP,
    installedApp = false,
    paymentLinkId,
    paymentGateway,
    storeBranchPickup,
    selectedInstallment
  }: RequestOrderCreateBasicFieldService) {
    const order = new Order()
    const createdAt = new Date()
    const year = createdAt.getFullYear()
    const mount = createdAt.getMonth() + 1
    customer.addresses = []
    customer.password = null
    customer.passwordSalt = null

    const sequence = `ORD-${year}${mount < 10 ? '0' : ''}${mount}${createdAt.getHours()}${createdAt.getMinutes()}${createdAt.getSeconds()}`

    paymentMethod.extras = paymentLinkId ? [{ key: 'payment_link_id', value: paymentLinkId }] : []

    if (deliveryMode === 'own_delivery' || deliveryMode === 'delivery_company' || paymentGateway === 'stone') {
      customer.addresses.push(address)
    }

    if (paymentMethod.installmentsDetails && selectedInstallment.quantity) {
      if (paymentMethod.installmentsDetails.maxInstallments) {
        const details = { payment_installments: selectedInstallment.quantity }
        paymentMethod.details = details

        if (paymentMethod.installmentsDetails.applyInstallmentsFee && selectedInstallment.hasFee) {
          paymentMethod.details.payment_quota = selectedInstallment.feeValue
        }
      }
    }

    if (paymentMethod.details && paymentMethod.paymentOption.type === 'covenant') {
      if (paymentMethod.details.payment_maxInstallments && selectedInstallment.quantity) {
        paymentMethod.details.payment_installments = selectedInstallment.quantity
      }
    }

    order._id = undefined
    order.sequence = sequence
    order.cupom = null
    order.tagCode = null
    order.comment = comment
    order.customer = customer
    order.products = products
    order.clientIP = clientIP.toString()
    order.userAgent = userAgent
    order.totalOrder = totalOrder
    order.moneyChange = moneyChange
    order.statusOrder = statusOrder
    order.paymentCode = paymentCode
    order.installedApp = installedApp
    order.deliveryData = deliveryData
    order.deliveryMode = deliveryMode
    order.paymentMethod = paymentMethod
    order.healthInsurance = healthInsurance
    order.createdAt = createdAt
    order.branchPickup = storeBranchPickup


    return order
  }
}

export default OrderCreateBasicFieldService
