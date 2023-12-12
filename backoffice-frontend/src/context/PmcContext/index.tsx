import React, { createContext } from 'react'
import { BaseApi } from '../../config'
import Pmc from '../../interfaces/pmc'
import { getPmcs } from '../../services/api'
import { BasicFilterRequest } from '../../services/api/interfaces/ApiRequest'
import { BaseContextProvider, BaseContextState } from '../BaseContext'

interface ContextState extends BaseContextState {
    pmcs: Pmc[]
}

interface ContextData extends ContextState {
    getPmcs: (data?: BasicFilterRequest) => Promise<void>
}

const context = createContext({} as ContextData)
export default context
const { Provider, Consumer } = context

export const PmcConsumer = Consumer

export class PmcProvider extends BaseContextProvider {
    state: ContextState = {
        pmcs: [],
    }

    getPmcs = async (data?: BasicFilterRequest) => {
        await this.startRequest(BaseApi)
        const response = await getPmcs(data)
        this.processResponse(response, ['pmcs'])
    }

    render() {
        const { children } = this.props
        return (
            <Provider
                value={{
                    ...this.state,
                    getPmcs: this.getPmcs,
                }}
            >
                {children}
            </Provider>
        )
    }
}
