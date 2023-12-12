import React, { createContext } from 'react'
import { ApiShipping } from '../../config'
import { ISender } from '../../interfaces/sender'
import Tracking from '../../interfaces/tracking'

import { getTrackingShipping, requestAccessToken } from '../../services/api'
import { BaseContextProvider, BaseContextState } from '../BaseContext'

interface ApiShippingContextState extends BaseContextState {
  ok: boolean
  tracking: string | Tracking[]
}

interface ApiShippingContextData extends ApiShippingContextState {
  requesGetAccessToken: (...args: any) => Promise<void>
  requestGetShippingStatus: (...args: any) => Promise<void>
}

const ApiShippingContext = createContext({} as ApiShippingContextData)
export default ApiShippingContext

const { Consumer, Provider } = ApiShippingContext
export const ApiShippingConsumer = Consumer

export class ApiShippingProvider extends BaseContextProvider {
  state: ApiShippingContextState = {
    ok: false,
    tracking: []
  }

  requesGetAccessToken = async (code: string) => {
    this.startRequest(ApiShipping)
    const response = await requestAccessToken(code)

    this.processResponse(response)
  }

  requestGetShippingStatus = async (sender: ISender, trackingCode: string) => {
    this.startRequest(ApiShipping)

    const response = await getTrackingShipping(sender, trackingCode)

    this.processResponse(response, ['tracking'])
  }

  render() {
    const { children } = this.props
    return (
      <Provider
        value={{
          ...this.state,
          requesGetAccessToken: this.requesGetAccessToken,
          requestGetShippingStatus: this.requestGetShippingStatus
        }}
      >
        {children}
      </Provider>
    )
  }
}