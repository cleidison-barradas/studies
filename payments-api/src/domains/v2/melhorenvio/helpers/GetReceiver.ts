import { Customer } from '@mypharma/api-core'

export function getReceiver(customer: Customer) {
  const { fullName, phone, email, cpf } = customer

  const addresses = customer.addresses || []

  if (addresses.length <= 0) throw new Error('missing_customer_address')

  const parsedPhone = String(phone).replace(/\D+/g, '')
  const document = cpf.replace(/\D+/g, '') || '33091349039'
  const name = fullName
  const address = addresses[0].street
  const number = addresses[0].number
  const complement = addresses[0].complement
  const district = addresses[0].neighborhood.name
  const city = addresses[0].neighborhood.city.name
  const state_abbr = addresses[0].neighborhood.city.state.code
  const postal_code = addresses[0].postcode.replace(/\D+/g, '')

  return {
    email,
    name,
    note: '',
    city,
    number,
    address,
    document,
    district,
    state_abbr,
    complement,
    postal_code,
    phone: parsedPhone,
    country_id: 'BR',
  }
}
