import React, { createContext } from 'react'
import { BaseApi } from '../../config'
import StoreIntegration from '../../interfaces/storeIntegration'
import { getStoreIntegration, postStoreIntegration } from '../../services/api'
import { BaseContextProvider, BaseContextState } from '../BaseContext'

interface StoreIntegrationContextState extends BaseContextState {
  storeIntegration: StoreIntegration | null,
}

interface StoreIntegrationContextData extends StoreIntegrationContextState {
  postStoreIntegration: (data: StoreIntegration) => void,
  getStoreIntegration: () => void,
}

const StoreIntegrationContext = createContext({} as StoreIntegrationContextData)
export default StoreIntegrationContext

const { Consumer, Provider } = StoreIntegrationContext
export const StoreIntegrationConsumer = Consumer

export class StoreIntegrationProvider extends BaseContextProvider {
  state: StoreIntegrationContextState = {
    fetching: false,
    success: false,
    error: null,
    errorObjects: null,
    deletedId: null,
    pagination: null,
    storeIntegration: null,
  }

  getStoreIntegration = async () => {
    this.startRequest(BaseApi)
    const response = await getStoreIntegration()
    this.processResponse(response, ['storeIntegration'])
  }

  postStoreIntegration = async (data: StoreIntegration) => {
    this.startRequest(BaseApi)
    const response = await postStoreIntegration(data)
    this.processResponse(response, ['storeIntegration'])
  }

  render() {
    const { children } = this.props
    return (
      <Provider
        value={{
          ...this.state,
          ...this,
        }}
      >
        {children}
      </Provider>
    )
  }
}