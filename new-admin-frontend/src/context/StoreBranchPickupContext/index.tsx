import React, { createContext } from 'react'
import { BaseContextState, BaseContextProvider } from '../BaseContext'
import { deleteStoreBranchPickup, getStoreBranches, postStoreBranchPickup } from '../../services/api'
import { BaseApi } from '../../config'

export const TENANT_KEY = '@myp-admin/tenant'

interface StoreContextState extends BaseContextState {
  storeBranches: any[]
  deletedId: string | null
}

export interface StoreContextData extends StoreContextState {
  requestgetStoreBranchesPickup: (...args: any) => Promise<void>
  requestaddStoreBranchPickup: (...args: any) => Promise<void>
  requestdeleteStoreBranchPickup: (...args: any) => Promise<void>
}

// Create context
const context = createContext({} as StoreContextData)
export default context
const { Provider, Consumer } = context
// Export consumer
export const StoreBranchPickupConsumer = Consumer

export class StoreBranchPickupProvider extends BaseContextProvider {
  state: StoreContextState = {
    storeBranches: [],
    success: false,
    deletedId: null,
  }

  componentDidMount() {
    this.startRequest(BaseApi)
    this.requestgetStoreBranchesPickup()
  }

  requestgetStoreBranchesPickup = async () => {
    await this.startRequest(BaseApi)
    const response = await getStoreBranches({
      page: 1,
      limit: 100,
    })
    this.processResponse(response, ['storeBranches'])
  }

  requestaddStoreBranchPickup = async (data: any) => {
    await this.startRequest(BaseApi)
    const response = await postStoreBranchPickup(data)
    this.processResponse(response, ['store'])
  }

  requestdeleteStoreBranchPickup = async (data: any) => {
    await this.startRequest(BaseApi)
    const response = await deleteStoreBranchPickup(data)
    this.processResponse(response, ['deletedId'])
  }

  render() {
    const { children } = this.props
    return (
      <Provider
        value={{
          ...this.state,
          requestgetStoreBranchesPickup: this.requestgetStoreBranchesPickup,
          requestaddStoreBranchPickup: this.requestaddStoreBranchPickup,
          requestdeleteStoreBranchPickup: this.requestdeleteStoreBranchPickup,
        }}
      >
        {children}
      </Provider>
    )
  }
}
