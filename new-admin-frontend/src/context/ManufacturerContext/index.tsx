import React, { createContext } from 'react'
import { BaseApi } from '../../config'
import Manufacturer from '../../interfaces/manufacturer'
import { getManufacturers } from '../../services/api'
import { RequestGetManufacturer } from '../../services/api/interfaces/ApiRequest'
import { BaseContextProvider, BaseContextState } from '../BaseContext'

interface ManufacturerContextState extends BaseContextState {
  manufacturers: Manufacturer[]
}

interface ManufacturerContextData extends ManufacturerContextState {
  getManufacturers: (payload?: RequestGetManufacturer) => Promise<void>
}

const manufacturerContext = createContext({} as ManufacturerContextData)
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
    pagination: null,
    manufacturers: [],
  }

  getManufacturers = async (data?: RequestGetManufacturer) => {
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
          getManufacturers: this.getManufacturers,
        }}
      >
        {children}
      </Provider>
    )
  }
}
