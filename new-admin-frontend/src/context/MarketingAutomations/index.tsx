import React, { createContext } from 'react'
import { BaseApi } from '../../config'
import SnackbarContext from '../SnackbarContext'
import MarketingAutomations from '../../interfaces/marketingAutomations'
import { getMarketingAutomations, putMarketingAutomations, putMailCustomers } from '../../services/api'
import { IMarketingAutomationRequest } from '../../services/api/interfaces/ApiRequest'
import { BaseContextProvider, BaseContextState } from '../BaseContext'

interface MarketingAutomationContextState extends BaseContextState {
  automations: MarketingAutomations
}

interface MarketingAutomationContextData extends MarketingAutomationContextState {
  handleClipBoard: (...arsg: any) => void
  requestGetMarketingAutomations: (...args: any) => void
  requestPutMarketingAutomations: (...args: any) => void
  requestPutMailCustomers: (...args: any) => void
}

const MarketingAutomationContext = createContext({} as MarketingAutomationContextData)
export default MarketingAutomationContext

const { Consumer, Provider } = MarketingAutomationContext
export const MarketingAutomationConsumer = Consumer

export class MarketingAutomationProvider extends BaseContextProvider {
  static contextType = SnackbarContext
  context!: React.ContextType<typeof SnackbarContext>

  state: MarketingAutomationContextState = {
    automations: {
      status: false,
      RECENT_CART: false,
      MISS_YOU_15: false,
      MISS_YOU_20: false,
      MISS_YOU_30: false
    }
  }

  requestGetMarketingAutomations = async () => {
    this.startRequest(BaseApi)
    const response = await getMarketingAutomations()

    this.processResponse(response, ['automations'])
  }

  requestPutMarketingAutomations = async (data: IMarketingAutomationRequest) => {
    this.startRequest(BaseApi)
    const response = await putMarketingAutomations(data)

    this.processResponse(response, ['automations'])

    if (response.ok) {
      const { openSnackbar } = this.context

      openSnackbar('Alteracões salvas com sucesso', 'success')
    }
  }

  requestPutMailCustomers = async (data: IMarketingAutomationRequest) => {
    this.startRequest(BaseApi)
    const response = await putMailCustomers(data)

    this.processResponse(response, ['automations'])

    if (response.ok) {
      const { openSnackbar } = this.context

      openSnackbar('Alteracões salvas com sucesso', 'success')
    }

  }

  handleClipBoard = async (text: string) => {
    if (navigator.clipboard) {
      const { openSnackbar } = this.context
      await navigator.clipboard.writeText(text)

      openSnackbar('copiado para área de Transferência.', 'success')
    }

  }

  render() {
    const { children } = this.props
    return (
      <Provider
        value={{
          ...this.state,
          handleClipBoard: this.handleClipBoard,
          requestPutMailCustomers: this.requestPutMailCustomers,
          requestGetMarketingAutomations: this.requestGetMarketingAutomations,
          requestPutMarketingAutomations: this.requestPutMarketingAutomations
        }}
      >
        {children}
      </Provider>
    )
  }
}