import { createContext } from 'react'
import PaymentLink from '../../interfaces/paymentLink'
import PaymentLinkForm from '../../interfaces/paymentLinkForm'
import { BaseContextProvider, BaseContextState } from '../BaseContext'
import { PaymentLinkResponse } from '../../services/api/interfaces/ApiResponse'
import { deletePaymentLink, getCartByPaymentLink, getPaymentLinks, postPaymentLink } from '../../services/api'
import { BaseApi } from '../../config'
import { RequestGetPaymentLinks } from '../../services/api/interfaces/ApiRequest'
import PaymentLinkInformationsResponse from '../../interfaces/paymentLinkInformationsResponse'

interface PaymentLinkContextState extends BaseContextState {
  paymentLinks: PaymentLink[]
  count: number
}

interface PaymentLinkContextData extends PaymentLinkContextState {
  getPaymentLinks: (...args: any) => void
  createPaymentLink: (args: PaymentLinkForm) => Promise<PaymentLinkResponse | null>
  getCartByPaymentLink: (args: string) => Promise<PaymentLinkInformationsResponse>
  deletePaymentLink: (id: string) => Promise<void>
}

const paymentLinksContext = createContext({} as PaymentLinkContextData)
export default paymentLinksContext

const { Consumer, Provider } = paymentLinksContext
export const PaymentLinksConsumer = Consumer

export class PaymentLinkProvider extends BaseContextProvider {
  state: PaymentLinkContextState = {
    fetching: false,
    success: false,
    error: null,
    errorObjects: null,
    deletedId: null,
    pagination: null,
    paymentLinks: [],
    count: 0,
  }

  getPaymentLinks = async (data?: RequestGetPaymentLinks) => {
    this.startRequest(BaseApi)

    const response = await getPaymentLinks(data)

    this.processResponse(response, ['paymentLinks'])
  }

  createPaymentLink = async (paymentLinkForm: PaymentLinkForm): Promise<PaymentLinkResponse | null> => {
    const response = await postPaymentLink(paymentLinkForm)
    if (response.ok) {
      this.showMessage('Link de pagamento criado com sucesso', 'success')
      return response.data as PaymentLinkResponse
    }
    this.showMessage('Erro ao criar link de pagamento', 'error')
    return null
  }

  getCartByPaymentLink = async (paymentLinkId: string) => {
    const response = await getCartByPaymentLink(paymentLinkId)
    return response.data
  }

  deletePaymentLink = async (_id: string) => {
    this.startRequest(BaseApi)
    const response = await deletePaymentLink(_id!)
    this.processResponse(response)
  }

  render() {
    const { children } = this.props
    return (
      <Provider
        value={{
          ...this.state,
          getPaymentLinks: this.getPaymentLinks,
          createPaymentLink: this.createPaymentLink,
          getCartByPaymentLink: this.getCartByPaymentLink,
          deletePaymentLink: this.deletePaymentLink,
        }}
      >
        {children}
      </Provider>
    )
  }
}
