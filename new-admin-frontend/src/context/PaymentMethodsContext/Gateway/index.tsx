import React, { createContext } from 'react'
import { BaseContextProvider, BaseContextState } from '../../BaseContext'

import { BaseApi } from '../../../config'

import {
  getGatewaysMethod,
  putGatewayMethod,
  deleteGatewayMethod
} from '../../../services/api'

import PaymentMethods from '../../../interfaces/paymentMethods'
import { PutGatewayMethodRequest } from '../../../services/api/interfaces/ApiRequest'

interface GatewayMethodContextState extends BaseContextState {
  gateways: PaymentMethods[],
  fetching: boolean
}

interface GatewayMethodContextData extends GatewayMethodContextState {
  getGatewaysMethod: () => Promise<void>
  putGatewayMethod: (data: PutGatewayMethodRequest) => Promise<void>
  deleteGatewayMethod: (id: string) => Promise<void>
}

const context = createContext({} as GatewayMethodContextData)
const { Consumer, Provider } = context

export default context
export const GatewayMethodConsumer = Consumer

export class GatewayMethodProvider extends BaseContextProvider {
  GatewayMethod: GatewayMethodContextState = {
    gateways: [],
    fetching: false,
  }

  componentDidMount() {
    this.startRequest(BaseApi)
  }

  getGatewaysMethod = async () => {
    this.startRequest(BaseApi)
    const response = await getGatewaysMethod()

    if (!response.ok && response.data.error === 'gateways_not_found') {
      this.showMessage('Erro ao encontrar os métodos de pagamento por gateway', 'error')
    }

    if (!response.ok && response.data.error === 'do_not_have_gateway_payments_registred') {
      this.showMessage('Não possuem métodos de pagamento por gateway cadastrados', 'info')
      return
    }

    this.processResponse(response, ['gateways'])
  }

  putGatewayMethod = async (data: PutGatewayMethodRequest) => {
    this.startRequest(BaseApi)
    const response = await putGatewayMethod(data)

    if (response.ok && response.status === 201) {
      this.showMessage('Método de pagamento criado com sucesso!', 'success')
    }

    if (response.ok && response.status === 200) {
      this.showMessage('Método de pagamento atualizado com sucesso!', 'success')
    }

    if (!response.ok && response.data.error === 'unprocessable_entity' && response.status === 422) {
      this.showMessage('Erro ao atualizar o método de pagamento!', 'error')
      return
    }

    if (!response.ok && response.data.error === 'bad_request' && response.status === 400) {
      this.showMessage('Erro ao criar o método de pagamento!', 'error')
      return
    }

    if (!response.ok && response.status === 406 && response.data.error === 'not_acceptable_validation_error') {
      if (response.data.error_details === 'invalid_maxInstallments') {
        this.showMessage('Erro ao processar os dados, quantidade máxima de parcelas inváldidas, verifique os dados!', 'error')
        return
      }
      if (response.data.error_details === 'invalid_applyInstallmentsFeeFrom') {
        this.showMessage('Erro ao processar os dados, verifique os dados!', 'error')
        return
      }
      if (response.data.error_details === 'invalid_minValueToInstallments') {
        this.showMessage('Erro ao processar os dados, valor mínimo para habilitar o parcelamento inválido, verifique os dados!', 'error')
        return
      }
      if (response.data.error_details === 'invalid_cardsFlagFee') {
        this.showMessage('Erro ao processar os dados, valor de taxas inválidas, verifique as taxas em vermelho!', 'error')
        return
      }

      this.showMessage('Erro ao processar os dados, verifique seus dados!', 'error')
      return
    }

    this.processResponse(response, ['GatewayMethod'])
  }

  deleteGatewayMethod = async (id: string) => {
    this.startRequest(BaseApi)

    const response = await deleteGatewayMethod(id)

    if (response.ok) {
      this.showMessage('Método de pagamento removido!', 'success')
    } else if (!response.ok && response.data.error === 'gateway_not_found') {
      this.showMessage('Erro ao encontrar o método de pagamento', 'error')
    } else {
      this.showMessage('Erro ao remover o método de pagamento!', 'error')
    }

    this.processResponse(response, ['deletedId'])
  }

  render() {
    const { children } = this.props

    return (
      <Provider
        value={{
          ...this.GatewayMethod,
          ...this.state,
          getGatewaysMethod: this.getGatewaysMethod,
          putGatewayMethod: this.putGatewayMethod,
          deleteGatewayMethod: this.deleteGatewayMethod,
        }}
      >
        {children}
      </Provider>
    )
  }
}

