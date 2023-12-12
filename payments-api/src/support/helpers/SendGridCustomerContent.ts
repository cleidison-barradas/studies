import { Customer, Store } from '@mypharma/api-core'

interface GetCustomerContentDTO {
  orderId: string
  store: Store
  customer: Customer
  isRelatedOrderId?: boolean
}

export const getCustomerContent = ({ customer, isRelatedOrderId, orderId, store }: GetCustomerContentDTO) => {

  delete customer.password
  delete customer.addresses
  delete customer.passwordSalt

  const customerEmail = customer.email
  const customerOrder = new URL(`/pedido/${orderId}${isRelatedOrderId ? '?v=1' : ''}`, store.url)

  return {
    customerEmail,
    customerOrder,
    ...customer
  }
}