import Cart from './cart'
import PaymentLink from './paymentLink'

export default interface PaymentLinkInformationsResponse {
  paymentLink: PaymentLink
  cart: Cart
}
