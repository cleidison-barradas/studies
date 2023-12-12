import React, { createContext } from 'react'
import { BaseContextState, BaseContextProvider } from '../BaseContext'
import { importPmc } from '../../services/api'
import { ImportApi } from '../../config'
import { PostImportPmcRequest } from '../../services/api/interfaces/ApiRequest'

interface ImportContextState extends BaseContextState {
    ok: boolean
}

interface ImportContextData extends ImportContextState {
    requestImportPmc: (...args: any) => void
}

const ImportContext = createContext({} as ImportContextData)
export default ImportContext

const { Provider, Consumer } = ImportContext

export const ImportConsumer = Consumer

export class ImportProvider extends BaseContextProvider {
    state: ImportContextState = {
        ok: false,
    }

    requestImportPmc = async (data: PostImportPmcRequest) => {
        this.startRequest(ImportApi)
        const formData = new FormData()

        formData.append('file', data.file)
        formData.append('store', data.store)

        const response = await importPmc(formData)
        this.processResponse(response, ['ok'])
        if (response.ok) {
            this.showMessage('Arquivo enviado com sucesso', 'success')
        }
    }

    render() {
        const { children } = this.props
        return (
            <Provider
                value={{
                    ...this.state,
                    requestImportPmc: this.requestImportPmc,
                }}
            >
                {children}
            </Provider>
        )
    }
}
