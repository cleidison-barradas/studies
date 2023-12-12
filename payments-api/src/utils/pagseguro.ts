import { parseString } from 'xml2js'
import { Order, Customer, Address } from '@mypharma/api-core'
import { StatusCodes, PaymentType } from '../interfaces/utils/pagseguro/pagseguroInterfaces'
const { PAGSEGURO_URL, PAGSEGURO_NOTIFICATION_BASE } = process.env
import rp = require('request-promise')

interface Iinstallments {
  amount: number
  noInterestInstallmentQuantity?: number
  quantity: number
}

const paymentsOptions: PaymentType = {
  PAYMENT_CREDIT_CARD: 'creditCard',
  PAYMENT_BOLETO: 'boleto',
}

const isInSandbox = PAGSEGURO_URL.indexOf('sandbox') !== -1

const statusCodes: StatusCodes = {
  WAITING_PAYMENT: 1,
  UNDER_ANALYSIS: 2,
  PAID: 3,
  AVAILABLE: 4,
  UNDER_CONTEST: 5,
  REFUNDED: 6,
  CANCELED: 7,
}
const defaultOptions = (pagseguroEmail: string, pagseguroToken: string) => {
  return {
    method: 'POST',
    json: false,
    qs: {
      email: pagseguroEmail,
      token: pagseguroToken,
    },
  }
}

const startSession = async (pagseguroEmail: any, pagseguroToken: any) => {
  let session = null
  const uri = `${PAGSEGURO_URL}/sessions`
  const xml = await rp({ ...defaultOptions(pagseguroEmail, pagseguroToken), uri })

  parseString(xml, (err, res) => {
    session = res.session.id[0]
  })

  return session
}

const makeItem = (index: number, item: Record<string, any>) => {
  let obj = {}
  const price = item.promotionalPrice && Number(item.promotionalPrice) < Number(item.unitaryValue) ? Number(item.promotionalPrice) : Number(item.unitaryValue)

  obj[`itemId${index}`] = item.product._id.toString()
  obj[`itemDescription${index}`] = item.product.name
  obj[`itemAmount${index}`] = price.toFixed(2)
  obj[`itemQuantity${index}`] = item.amount

  return obj
}

const makeOrderForm = (
  order: Order,
  customer: Customer,
  address: Address,
  products: Order['products'],
  deliveryValue: number,
  installments: Iinstallments,
  paymentMethod: string,
  paymentOptionId: string,
  tenant: string,
  senderHash: string,
  creditCardToken: string,
  creditCardHolderName: string
) => {
  const telephone = customer.phone.toString().replace(/\D/g, '')
  const senderPhone = /([0-9]{2})([0-9]{7,9})/.exec(telephone)
  const senderIP = order.clientIP ? order.clientIP.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/) : null

  let genericForm: Record<string, any> = {
    paymentMethod,
    senderHash,
    currency: 'BRL',
    mode: 'default',
    senderIp: senderIP && senderIP[0] ? senderIP[0] : '127.0.0.1',
    senderName: `${customer.firstname} ${customer.lastname}`,
    senderEmail: !isInSandbox ? customer.email : 'fulano@sandbox.pagseguro.com.br',
    senderAreaCode: senderPhone[1] || 45,
    senderPhone: senderPhone[2] || '84150811',
    senderCPF: customer.cpf ? customer.cpf.replace(/\D/g, '') : '12752070063',
    shippingAddressRequired: true,
    shippingAddressStreet: address.street,
    shippingAddressComplement: address.complement,
    shippingAddressNumber: address.number || 'S/N',
    shippingAddressDistrict: address.neighborhood.name || 'Desconhecido',
    shippingAddressCity: address.neighborhood.city.name,
    shippingAddressState: address.neighborhood.city.state.code || address.neighborhood.city.state.name,
    shippingAddressCountry: 'BRA',
    shippingAddressPostalCode: address.postcode || '76820210',
    reference: order._id,
    notificationURL: `${PAGSEGURO_NOTIFICATION_BASE}/${tenant}/${paymentOptionId}`,
  }

  // Frete
  if (deliveryValue > 0.0) {
    genericForm = {
      ...genericForm,
      shippingCost: deliveryValue.toFixed(2),
    }
  }

  products.forEach((product, i) => {
    genericForm = { ...genericForm, ...makeItem(i + 1, product) }
  })

  if (paymentMethod === paymentsOptions.PAYMENT_CREDIT_CARD.toString()) {
    return {
      ...genericForm,
      creditCardToken,
      creditCardHolderName,
      creditCardHolderCPF: customer.cpf ? customer.cpf.replace(/\D/g, '') : '12752070063',
      creditCardHolderBirthDate: customer.birthdate || '19/10/1989',
      creditCardHolderAreaCode: senderPhone[1],
      creditCardHolderPhone: senderPhone[2],
      billingAddressStreet: address.street,
      billingAddressComplement: address.complement ? address.complement.slice(0, 35) : 'Desconhecido',
      billingAddressNumber: address.number || 'S/N',
      billingAddressDistrict: address.neighborhood.name || 'Desconhecido',
      billingAddressCity: address.neighborhood.city.name,
      billingAddressState: address.neighborhood.city.state.code || address.neighborhood.city.state.name,
      billingAddressCountry: 'BRA',
      billingAddressPostalCode: address.postcode || '76820210',
      installmentQuantity: installments.quantity,
      installmentValue: installments.amount.toFixed(2),
    }
  }

  if (paymentMethod === paymentsOptions.PAYMENT_BOLETO.toString()) {
    return {
      ...genericForm,
      paymentMode: 'default',
    }
  }

  return null
}

const startOrder = async (
  order: Order,
  customer: Customer,
  address: Address,
  products: Order['products'],
  deliveryValue: number,
  installments: Iinstallments,
  senderHash: string,
  paymentMethod: string,
  paymentOptionId: string,
  tenant: string,
  pagseguroEmail: string,
  pagseguroToken: string,
  cardToken: string,
  cardHolder: string
) => {
  const uri = `${PAGSEGURO_URL}/v2/transactions`
  const response = await rp({
    ...defaultOptions(pagseguroEmail, pagseguroToken),
    uri,
    form: {
      ...makeOrderForm(
        order,
        customer,
        address,
        products,
        deliveryValue,
        installments,
        paymentMethod,
        paymentOptionId,
        tenant,
        senderHash,
        cardToken,
        cardHolder
      ),
    },
  })
  let result = null
  parseString(response, (err, res) => {
    result = res
  })

  return result
}

const refundOrder = async (transactionCode: string, pagseguroEmail: string, pagseguroToken: string) => {
  const uri = `${PAGSEGURO_URL}/v2/transactions/refunds`
  const response = await rp({
    ...defaultOptions(pagseguroEmail, pagseguroToken),
    uri,
    form: { transactionCode },
  })
  let result = null

  parseString(response, (err, res) => {
    result = res
  })

  return result
}

const getNotification = async (notificationCode: string, pagseguroEmail: string, pagseguroToken: string) => {
  let result = null
  const uri = `${PAGSEGURO_URL}/v3/transactions/notifications/${notificationCode}`
  const response = await rp({
    ...defaultOptions(pagseguroEmail, pagseguroToken),
    method: 'GET',
    uri,
  })
  parseString(response, (err, res) => {
    result = res
  })

  return result
}

export { startSession, startOrder, refundOrder, getNotification }
