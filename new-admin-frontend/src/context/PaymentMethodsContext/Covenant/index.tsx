import React, { createContext } from 'react'
import { BaseContextProvider, BaseContextState } from '../../BaseContext'

import { BaseApi } from '../../../config'

import {
  getCovenantMethod,
  putCovenantMethod,
  deleteCovenantMethod
} from '../../../services/api'

import PaymentMethods from '../../../interfaces/paymentMethods'
import { PutCovenantMethodRequest } from '../../../services/api/interfaces/ApiRequest'


interface CovenantMethodContextState extends BaseContextState {
  paymentMethod: PaymentMethods[],
  fetching: boolean
}

interface CovenantMethodContextData extends CovenantMethodContextState {
  getCovenantMethod: (id?: string) => Promise<void>
  putCovenantMethod: (data: PutCovenantMethodRequest) => Promise<void>
  deleteCovenantMethod: (id: string) => Promise<void>
}

const context = createContext({} as CovenantMethodContextData)
const { Consumer, Provider } = context

export default context
export const CovenantMethodConsumer = Consumer

export class CovenantMethodContext extends BaseContextProvider {
  state: CovenantMethodContextState = {
    paymentMethod: [],
    fetching: false,
  }

  componentDidMount() {
    this.startRequest(BaseApi)
  }

  getCovenantMethod = async (id?: string) => {
    this.startRequest(BaseApi)
    const response = await getCovenantMethod(id)

    this.processResponse(response, ['covenantMethod'])
  }

  putCovenantMethod = async (data: PutCovenantMethodRequest) => {
    this.startRequest(BaseApi)
    const response = await putCovenantMethod(data)

    this.processResponse(response, ['covenantMethod'])
  }

  deleteCovenantMethod = async (id: string) => {
    this.startRequest(BaseApi)
    const response = await deleteCovenantMethod(id)

    this.processResponse(response, [])

    if (response.ok) {
      this.showMessage('O Pagameto por convênio foi desativado!', 'success')
    }
  }

  render() {
    const { children } = this.props

    return (
      <Provider
        value={{
          ...this.state,
          getCovenantMethod: this.getCovenantMethod,
          putCovenantMethod: this.putCovenantMethod,
          deleteCovenantMethod: this.deleteCovenantMethod,
        }}
      >
        {children}
      </Provider>
    )
  }
}

