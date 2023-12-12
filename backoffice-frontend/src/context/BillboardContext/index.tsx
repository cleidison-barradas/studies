import React, { createContext } from 'react'
import { BaseApi } from '../../config'
import { BaseContextProvider, BaseContextState } from '../BaseContext'
import { Billboard } from '../../interfaces/billboard'
import { deleteBillboard, getBillboard, putBillboard } from '../../services/api'
import { PutBillboardRequest } from '../../services/api/interfaces/ApiRequest'

export const TENANT_KEY = '@myp-admin/tenant'
export const USER_KEY = '@myp-admin/user'

interface BillboardContextState extends BaseContextState {
    billboards: Billboard[]
    billboard?: Billboard
}

interface BillboardContextData extends BillboardContextState {
    getBillboard: (id?: Billboard['_id']) => Promise<void>
    putBillboard: (data: PutBillboardRequest) => Promise<void>
    deleteBillboard: (id: Billboard['_id']) => Promise<void>
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
        billboards: [],
    }

    getBillboard = async (id?: Billboard['_id']) => {
        this.startRequest(BaseApi)
        const response = await getBillboard(id)
        this.processResponse(response, ['billboards', 'billboard'])
    }

    putBillboard = async (data: PutBillboardRequest) => {
        this.startRequest(BaseApi)
        const response = await putBillboard(data)
        this.processResponse(response, ['billboard'])
        if (response.ok) {
            this.showMessage(data.billboard._id ? 'Aviso atualizado com sucesso' : 'Aviso criado com sucesso', 'info')
        }
    }

    deleteBillboard = async (id: Billboard['_id']) => {
        this.startRequest(BaseApi)
        const response = await deleteBillboard(id)
        this.processResponse(response)
        if (response.ok) {
            this.showMessage('Aviso deletado com sucesso', 'info')
        }
    }

    render() {
        const { children } = this.props
        return (
            <Provider
                value={{
                    ...this.state,
                    getBillboard: this.getBillboard,
                    putBillboard: this.putBillboard,
                    deleteBillboard: this.deleteBillboard,
                }}
            >
                {children}
            </Provider>
        )
    }
}
