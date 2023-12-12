import { paymentApi } from '../../config/api'
import { handleErrorResponse } from '../../helpers/handleErrorResponse'
import { GetPaymentMethodsResponse } from './response.interface'

export async function getPaymentMethods() {
  return paymentApi
    .get<GetPaymentMethodsResponse>('v2/payment/methods')
    .then((res) => res.data)
    .catch(handleErrorResponse)
}
