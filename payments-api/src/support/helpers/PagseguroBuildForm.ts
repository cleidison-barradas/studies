import { Order } from '@mypharma/api-core'
import {
  IInstallments,
  IPagseguroTransaction
} from '../interfaces/pagseguro.plugin'
import { buildTransactionProduct } from './PagseguroBuildItem'
import pagseguroConfig from '../../config/pagseguro'

export const PagseguroBuildForm = (order: Order, referenceId: string, card_name: string, card_token: string, card_cpf: string, sender_hash: string, installment: IInstallments, receiverEmail: string, tenant: string, paymentId: string) => {
  let formData: IPagseguroTransaction | null = null
  const { customer, products, deliveryData } = order
  const { addresses = [], cpf = '', phone } = customer

  const isInSandbox = pagseguroConfig.baseUrl.indexOf('sandbox') !== -1

  const address = addresses[0]

  if (!address) {

    throw new Error('address_not_found')
  }

  const { postcode, neighborhood } = address

  const defaultPostalCode = '85805-000'
  const postalCode = postcode && postcode.length > 0 ? postcode.replace(/\D/g, '') : defaultPostalCode.replace(/\D/g, '')
  const documentCPF = cpf ? cpf.replace(/\D/g, '') : card_cpf.replace(/\D/g, '')
  const telephone = phone.toString().replace(/\D/g, '')

  const senderPhone = /([0-9]{2})([0-9]{7,9})/.exec(telephone)
  const addressNumber = String(address.number || '001').replace(/\D/g, '')

  if (documentCPF.length <= 0) {

    throw new Error('sender_document_invalid')
  }

  formData = {} as any
  formData.currency = 'BRL'
  formData.paymentMode = 'default'
  formData.paymentMethod = 'creditCard'
  formData.receiverEmail = receiverEmail
  formData.reference = referenceId

  formData.senderName = customer.fullName
  formData.senderAreaCode = senderPhone[1]
  formData.senderPhone = senderPhone[2]
  formData.senderCPF = documentCPF
  formData.senderEmail = !isInSandbox ? customer.email : 'fulano@sandbox.pagseguro.com.br'
  formData.senderHash = sender_hash

  if (deliveryData.feePrice > 0) {
    formData.shippingCost = deliveryData.feePrice.toFixed(2)
  }

  formData.shippingAddressCountry = 'BRA'
  formData.shippingAddressPostalCode = postalCode
  formData.shippingAddressComplement = neighborhood.city.name
  formData.shippingAddressCity = neighborhood.city.name
  formData.shippingAddressDistrict = neighborhood.name
  formData.shippingAddressState = neighborhood.city.state.code
  formData.shippingAddressComplement = address.complement
  formData.shippingAddressNumber = addressNumber
  formData.shippingAddressStreet = address.street

  formData.creditCardToken = card_token
  formData.installmentQuantity = installment.quantity
  formData.installmentValue = installment.amount.toFixed(2)

  formData.creditCardHolderName = card_name
  formData.creditCardHolderCPF = documentCPF
  formData.creditCardHolderBirthDate = customer.birthdate || '27/02/1987'
  formData.creditCardHolderAreaCode = senderPhone[1]
  formData.creditCardHolderPhone = senderPhone[2]

  formData.billingAddressCity = neighborhood.city.name
  formData.billingAddressComplement = neighborhood.city.name
  formData.billingAddressCountry = 'BRA'
  formData.billingAddressDistrict = neighborhood.name
  formData.billingAddressNumber = addressNumber
  formData.billingAddressPostalCode = postalCode
  formData.billingAddressState = neighborhood.city.state.code
  formData.billingAddressStreet = address.street

  formData.notificationURL = new URL(`/v2/notifications/pagseguro/${tenant}/${paymentId}`, pagseguroConfig.notificationURL).href

  products.forEach((product, index) => {

    formData = {
      ...formData,
      ...buildTransactionProduct(index + 1, product)
    }
  })

  return formData
}