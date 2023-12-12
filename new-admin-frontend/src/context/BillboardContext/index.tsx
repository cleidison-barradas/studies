import React, { createContext } from 'react'
import { BaseApi } from '../../config'
import IBillboard from '../../interfaces/billboard'
import { getBillboard } from '../../services/api'
import { BaseContextProvider, BaseContextState } from '../BaseContext'

export const TENANT_KEY = '@myp-admin/tenant'
export const USER_KEY = '@myp-admin/user'

interface BillboardContextState extends BaseContextState {
  billboard: IBillboard[]
}

interface BillboardContextData extends BillboardContextState {
  getBillboard: () => Promise<void>
}

const billboardContext = createContext({} as BillboardContextData)
export default billboardContext

const { Consumer, Provider } = billboardContext
export const BillboardConsumer = Consumer

export class BillboardProvider extends BaseContextProvider {
  state: BillboardContextState = {
    fetching: false,
    success: false,
    error: null,
    errorObjects: null,
    deletedId: null,
    pagination: null,
    billboard: [],
  }

  getBillboard = async () => {
    this.startRequest(BaseApi)

    const response = await getBillboard()
    this.processResponse(response, ['billboard'])
  }

  render() {
    const { children } = this.props

    return (
      <Provider
        value={{
          ...this.state,
          getBillboard: this.getBillboard,
        }}
      >
        {children}
      </Provider>
    )
  }
}
