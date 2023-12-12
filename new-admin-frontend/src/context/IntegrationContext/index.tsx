import React, { createContext } from 'react'
import { BaseApi, BaseApiOrdersToErps } from '../../config'
import { Integration } from '../../interfaces/integration'
import { getIntegration, getApiIntegration, postGenerateToken } from '../../services/api'
import { BaseContextProvider, BaseContextState } from '../BaseContext'

interface IntegrationContextState extends BaseContextState {
  integration: Integration | null,
  apiIntegration: any | null
}

export interface IntegrationContextData extends IntegrationContextState {
  getIntegration: () => Promise<Integration | null>,
  getApiIntegration: () => void,
  requestGenerateToken: (...args: any) => void
}

const IntegrationContext = createContext({} as IntegrationContextData)
export default IntegrationContext

const { Consumer, Provider } = IntegrationContext
export const IntegrationConsumer = Consumer

export class IntegrationProvider extends BaseContextProvider {
  state: IntegrationContextState = {
    fetching: false,
    success: false,
    error: null,
    errorObjects: null,
    deletedId: null,
    pagination: null,
    integration: null,
    apiIntegration: null
  }

  getIntegration = async () => {
    this.startRequest(BaseApi)
    const response = await getIntegration()
    this.processResponse(response, ['integration'])

    if (this.state.success) {
      return this.state.integration
    }

    throw this.state.error
  }

  getApiIntegration = async () => {
    this.startRequest(BaseApi)
    const response = await getApiIntegration()
    this.processResponse(response, ['apiIntegration'])

    if (this.state.success) {
      return this.state.integration
    }

    throw this.state.error
  }

  requestGenerateToken = async (storeId: string, email: string) => {
    this.startRequest(BaseApiOrdersToErps)
    const response = await postGenerateToken(storeId, email)
    this.processResponse(response)
  }

  render() {
    const { children } = this.props
    return (
      <Provider
        value={{
          ...this.state,
          getIntegration: this.getIntegration,
          getApiIntegration: this.getApiIntegration,
          requestGenerateToken: this.requestGenerateToken
        }}
      >
        {children}
      </Provider>
    )
  }
}