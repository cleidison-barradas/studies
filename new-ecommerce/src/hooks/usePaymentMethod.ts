import PaymentOption from '../interfaces/paymentOption'
import useSWR from 'swr'
import { getPaymentMethods } from '../services/payment/payment.service'

export const usePaymentMethod = () => {
  const { data: paymentOptionsRequest } = useSWR('paymentMethods', getPaymentMethods)

  const findOption = (name: string, type: PaymentOption['type']) => {
    return paymentOptionsRequest?.paymentMethods
      .find(payment =>
        payment.paymentOption.name.includes(name) && payment.paymentOption.type.includes(type))
  }

  const getActiveGatewayCardMethod = () => paymentOptionsRequest?.paymentMethods.find(payment => payment.active === true)

  return {
    getActiveGatewayCardMethod,
    findOption
  }
}
