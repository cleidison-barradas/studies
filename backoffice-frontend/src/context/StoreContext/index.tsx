import React, { createContext } from 'react'
import { BaseApi } from '../../config'
import { IntegrationApiBody } from '../../interfaces/integrationApi'
import Store from '../../interfaces/store'
import { deleteStore, getStore, getApiIntegration, getStores, postStore, putStore, putApiIntegration, getStoresGmvReport, putMainStore } from '../../services/api'
import { GetStoresRequest, PutStoreRequest } from '../../services/api/interfaces/ApiRequest'
import { BaseContextProvider, BaseContextState } from '../BaseContext'
import File from '../../interfaces/file'

interface ContextState extends BaseContextState {
    stores: Store[]
    store: Store | null,
    integrationData: any
    report: File | null
}

interface ContextData extends ContextState {
    getStores: (data?: GetStoresRequest) => Promise<void>
    getStore: (_id: Store['_id']) => Promise<void>
    putStore: (data?: PutStoreRequest) => Promise<void>
    getApiIntegration: (_id: Store['_id']) => Promise<void>
    putApiIntegration: (_id: Store['_id'], integrationData: any) => Promise<void>
    postStore: (storeId: string, data: PutStoreRequest) => Promise<void>
    deleteStore: (_id?: Store['_id']) => Promise<void>
    getStoreGmvReport: (data: any) => Promise<void>
    putMainStoreRequest: (storeId: string, data: PutStoreRequest) => void
}

const storeContext = createContext({} as ContextData)
export default storeContext
const { Provider, Consumer } = storeContext

export const StoreConsumer = Consumer

export class StoreProvider extends BaseContextProvider {
    state: ContextState = {
        stores: [],
        store: null,
        report: null,
        integrationData: null
    }

    getStores = async (data?: GetStoresRequest) => {
        this.startRequest(BaseApi)
        const response = await getStores(data)
        this.processResponse(response, ['stores'])
    }

    getStore = async (_id: Store['_id']) => {
        this.startRequest(BaseApi)
        const response = await getStore(_id)
        this.processResponse(response, ['store'])
    }

    putStore = async (data?: PutStoreRequest) => {
        this.startRequest(BaseApi)
        const response = await putStore(data)
        this.processResponse(response, ['stores'])
        if (response.ok) {
            this.showMessage('Loja criada com sucesso', 'success')
        } else {
            this.showMessage(`'Ocorreu um erro ${response.data.error}`, 'error')
        }
    }

    getApiIntegration = async (_id: any) => {
        this.startRequest(BaseApi)
        const response = await getApiIntegration(_id)
        this.processResponse(response, ['integrationData'])
    }

    putApiIntegration = async (_id: Store['_id'], integrationData: IntegrationApiBody) => {
        this.startRequest(BaseApi)
        const response = await putApiIntegration(_id, integrationData)
        this.processResponse(response, ['integrationData'])
        if (response.ok) {
            this.showMessage('Dados de integração atualizados com sucesso.', 'success')
        } else {
            this.showMessage(`'Ocorreu um erro ${response.data.error}`, 'error')
        }
    }



    postStore = async (storeId: string, data: PutStoreRequest) => {
        this.startRequest(BaseApi)
        const response = await postStore(storeId, data)
        this.processResponse(response, ['store'])
        if (response.ok) {
            this.showMessage('Loja alterada com sucesso', 'success')
        }
    }

    deleteStore = async (_id: Store['_id']) => {
        this.startRequest(BaseApi)
        const response = await deleteStore(_id)
        this.processResponse(response, [])
        if (response.ok) {
            this.showMessage('Loja deletada com sucesso', 'success')
        }
    }

    getStoreGmvReport = async (data: any) => {
        this.startRequest(BaseApi)

        console.log(JSON.stringify(data))

        const response = await getStoresGmvReport({ data })

        this.processResponse(response, ['report'])
    }

    putMainStoreRequest = async (storeId: string, data: PutStoreRequest) => {
        this.startRequest(BaseApi)
        const response = await putMainStore(storeId, data)

        this.processResponse(response, ['store'])

        if (response.ok) {
            this.showMessage('Loja alterada com sucesso', 'success')
        }
    }

    render() {
        const { children } = this.props
        return (
            <Provider
                value={{
                    ...this.state,
                    getStores: this.getStores,
                    putStore: this.putStore,
                    getApiIntegration: this.getApiIntegration,
                    putApiIntegration: this.putApiIntegration,
                    deleteStore: this.deleteStore,
                    getStore: this.getStore,
                    postStore: this.postStore,
                    getStoreGmvReport: this.getStoreGmvReport,
                    putMainStoreRequest: this.putMainStoreRequest
                }}
            >
                {children}
            </Provider>
        )
    }
}
