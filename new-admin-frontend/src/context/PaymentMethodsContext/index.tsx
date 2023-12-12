import React, { createContext } from 'react'
import { BaseContextState, BaseContextProvider } from '../BaseContext'
import { getPayments, putPayment, deletePayments, getPaymentsOption, addPaymentOption, putPix } from '../../services/api'

import { BaseApi } from '../../config'
import { RequestGetPayments, RequestPutPayment, RequestPutPaymentOption } from '../../services/api/interfaces/ApiRequest'
import PaymentMethods from '../../interfaces/paymentMethods'
import PaymentOption from '../../interfaces/paymentOption'

interface PaymentMethodsContextState extends BaseContextState {
  fetching: boolean
  payments: PaymentMethods[]
  paymentOptions: PaymentOption[]
}

interface PaymentMethodsContextData extends PaymentMethodsContextState {
  requestGetPayments: (payload: RequestGetPayments) => Promise<void>
  requestsavePayment: (payload: RequestPutPayment) => Promise<void>
  requestPutPix: (payload: FormData) => Promise<void>
  requestdeletePayment: (_id: string) => Promise<void>
  requestGetPaymentOption: () => Promise<void>
  requestAddNewPaymentOption: (data: RequestPutPaymentOption) => Promise<void>
}

// Create context
const context = createContext({} as PaymentMethodsContextData)

const { Provider, Consumer } = context

export default context

export const PaymentMethodsConsumer = Consumer

export class PaymentMethodsProvider extends BaseContextProvider {
  state: PaymentMethodsContextState = {
    fetching: false,
    payments: [],
    paymentOptions: [],
  }

  componentDidMount() {
    this.startRequest(BaseApi)
  }

  requestGetPayments = async (payload: RequestGetPayments) => {
    this.startRequest(BaseApi)
    const response = await getPayments(payload)

    this.processResponse(response, ['payments'])
  }

  requestsavePayment = async (payload: RequestPutPayment) => {
    this.startRequest(BaseApi)

    const response = await putPayment(payload)
    if (response.ok) {
      this.showMessage('Metodos de pagamento atualizados com sucesso', 'success')
    }
    this.processResponse(response)
  }

  requestPutPix = async (payload: FormData) => {
    this.startRequest(BaseApi)

    const response = await putPix(payload)
    if (response.ok) {
      this.showMessage('Metodos de pagamento atualizados com sucesso', 'success')
    }
    this.processResponse(response)
  }

  requestdeletePayment = async (_id: string) => {
    this.startRequest(BaseApi)

    const response = await deletePayments(_id)
    this.processResponse(response, ['deletedId'])
  }

  requestGetPaymentOption = async () => {
    this.startRequest(BaseApi)

    const response = await getPaymentsOption()

    this.processResponse(response, ['paymentOptions'])
  }

  requestAddNewPaymentOption = async (data: any) => {
    this.startRequest(BaseApi)

    const response = await addPaymentOption(data)

    if (response.ok) {
      this.showMessage('Opção de pagamento cadastrada com sucesso', 'success')
    }

    if (!response.ok && response.data.error === 'payment_option_name_already_exists') {
      this.showMessage('Método de pagamento de pagamento já cadastrado!', 'warning')
      return
    }

    this.processResponse(response)
  }

  render() {
    const { children } = this.props

    return (
      <Provider
        value={{
          ...this.state,
          requestGetPayments: this.requestGetPayments,
          requestsavePayment: this.requestsavePayment,
          requestdeletePayment: this.requestdeletePayment,
          requestGetPaymentOption: this.requestGetPaymentOption,
          requestAddNewPaymentOption: this.requestAddNewPaymentOption,
          requestPutPix: this.requestPutPix,
        }}
      >
        {children}
      </Provider>
    )
  }
}
