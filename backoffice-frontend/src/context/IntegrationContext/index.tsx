import React, { createContext } from 'react'
import { BaseContextState, BaseContextProvider } from '../BaseContext'
import { BaseApi } from '../../config'
import { getIntegrationsLog } from '../../services/api'

import IntegrationLog from '../../interfaces/integrationLog'
import { GetIntegrationLogRequest } from '../../services/api/interfaces/ApiRequest'

interface IntegrationLogContextState extends BaseContextState {
    integrations: IntegrationLog[]
}

interface IntegrationLogContextData extends IntegrationLogContextState {
    requestGetIntegrationLog: (...args: any) => void
}

const IntegrationLogContext = createContext({} as IntegrationLogContextData)
export default IntegrationLogContext

const { Provider, Consumer } = IntegrationLogContext

export const IntegrationLogConsumer = Consumer

export class IntegrationLogProvider extends BaseContextProvider {
    state: IntegrationLogContextState = {
      integrations: [],
    }

    requestGetIntegrationLog = async (data: GetIntegrationLogRequest) => {
      this.startRequest(BaseApi)
      const response = await getIntegrationsLog(data)

      this.processResponse(response, ['integrations'])
    }

    render() {
        const { children } = this.props
        return (
            <Provider
                value={{
                    ...this.state,
                    requestGetIntegrationLog: this.requestGetIntegrationLog,
                }}
            >
                {children}
            </Provider>
        )
    }
}
