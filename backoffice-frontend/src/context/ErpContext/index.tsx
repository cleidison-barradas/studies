import React, { createContext } from 'react'
import { BaseApi } from '../../config'
import Erp from '../../interfaces/erp'
import IntegrationErpVersion from '../../interfaces/integrationErpVersion'
import { createErp, deleteErp, getErp, getErps, getErpVersions, updateErp } from '../../services/api'
import { BasicFilterRequest } from '../../services/api/interfaces/ApiRequest'
import { BaseContextProvider, BaseContextState } from '../BaseContext'

interface ContextState extends BaseContextState {
    erps: Erp[]
    erp: Erp | null
    versions: IntegrationErpVersion[]
}

interface ContextData extends ContextState {
    getErps: (data?: BasicFilterRequest) => Promise<void>
    getErp: (id: string) => Promise<void>
    updateErp: (erp: Erp) => Promise<void>
    createErp: (erp: Erp) => Promise<void>
    deleteErp: (id: string) => Promise<void>
    getErpVersions: (data?: BasicFilterRequest) => Promise<void>
}

const context = createContext({} as ContextData)
export default context
const { Provider, Consumer } = context

export const ErpConsumer = Consumer

export class ErpProvider extends BaseContextProvider {
    state: ContextState = {
        erps: [],
        versions: [],
        erp: null,
    }

    getErps = async (data?: BasicFilterRequest) => {
        await this.startRequest(BaseApi)
        const response = await getErps(data)
        this.processResponse(response, ['erps'])
    }

    getErp = async (id: string) => {
        await this.startRequest(BaseApi)
        const response = await getErp(id)
        this.processResponse(response, ['erp'])
    }

    getErpVersions = async (data?: BasicFilterRequest) => {
        await this.startRequest(BaseApi)
        const response = await getErpVersions(data)
        this.processResponse(response, ['versions'])
    }

    deleteErp = async (id: string) => {
        await this.startRequest(BaseApi)
        const response = await deleteErp(id)
        this.processResponse(response, [])
        if (response.ok) {
            this.showMessage('Erp removido com sucesso', 'success')
        }
    }

    updateErp = async (erp: Erp) => {
        await this.startRequest(BaseApi)
        const response = await updateErp(erp)
        this.processResponse(response, ['erp'])
        if (response.ok) {
            this.showMessage('Erp atualizado com sucesso', 'success')
        }
    }

    createErp = async (erp: Erp) => {
        await this.startRequest(BaseApi)
        const response = await createErp(erp)
        this.processResponse(response, ['erp'])
        if (response.ok) {
            this.showMessage('Erp criado com sucesso', 'success')
        }
    }

    render() {
        const { children } = this.props
        return (
            <Provider
                value={{
                    ...this.state,
                    getErps: this.getErps,
                    getErpVersions: this.getErpVersions,
                    updateErp: this.updateErp,
                    deleteErp: this.deleteErp,
                    createErp: this.createErp,
                    getErp: this.getErp,
                }}
            >
                {children}
            </Provider>
        )
    }
}
