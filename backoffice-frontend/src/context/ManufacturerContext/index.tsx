import React, { createContext } from 'react'
import { BaseApi } from '../../config'
import { getManufacturers } from '../../services/api'
import { BaseContextProvider, BaseContextState } from '../BaseContext'
import Manufacturer from '../../interfaces/manufacturer'

export const TENANT_KEY = '@myp-admin/tenant'
export const USER_KEY = '@myp-admin/user'

interface ManufacturerContextState extends BaseContextState {
    manufacturers: Manufacturer[]
}

interface ManufacutrerContextData extends ManufacturerContextState {
    getManufacturer: (data : any) => Promise<void>
}

const manufacturerContext = createContext({} as ManufacutrerContextData)
export default manufacturerContext

const { Consumer, Provider } = manufacturerContext
export const ManufacturerConsumer = Consumer

export class ManufacturerProvider extends BaseContextProvider {
    state: ManufacturerContextState = {
        fetching: false,
        success: false,
        error: null,
        errorObjects: null,
        deletedId: null,
        manufacturers: [],
    }

    getManufacturer = async (data : any) => {
        this.startRequest(BaseApi)
        const response = await getManufacturers(data)
        this.processResponse(response, ['manufacturers'])
    }

    render() {
        const { children } = this.props
        return (
            <Provider
                value={{
                    ...this.state,
                    getManufacturer: this.getManufacturer,
                }}
            >
                {children}
            </Provider>
        )
    }
}
