import React, { createContext } from 'react'
import { BaseContextState, BaseContextProvider } from '../BaseContext'
import {
  getStoreDeliveries,
  saveStoreDeliveries,
  deleteStoreDeliveries,
  getStateDeliveries,
  getCitiesDeliveries,
  getNeighborhoodsDeliveries,
  addNeighborhood,
  getStoreDistanceDeliveries,
  saveStoreDistanceDeliveries,
  deleteStoreDistanceDeliveries,
} from '../../services/api'
import DeliveryFeeInterface from '../../interfaces/deliveryFee'
import DistanceDeliveryFeeInterface from '../../interfaces/distanceDeliveryFee'
import State from '../../interfaces/state'
import CityInterface from '../../interfaces/city'
import { Neighborhood as NeighborhoodInterface } from '../../interfaces/neighborhood'

import { BaseApi } from '../../config'

interface StoreDeliveryContextState extends BaseContextState {
  deliveryFees: DeliveryFeeInterface[]
  distanceDeliveryFees: DistanceDeliveryFeeInterface[],
  deletedId: string | null
  fetching: boolean
  states: State[]
  cities: CityInterface[]
  neighborhoods: NeighborhoodInterface[]
  neighborhood: NeighborhoodInterface | null
}

interface StoreDeliveryContextData extends StoreDeliveryContextState {
  requestGetStoreDeliveries: (...args: any) => void
  requestGetStoreDistanceDeliveries: (...args: any) => void
  requestSaveStoreDeliveries: (...args: any) => void
  requestSaveStoreDistanceDeliveries: (...args: any) => void
  requestDeleteStoreDeliveries: (...args: any) => void
  requestDeleteStoreDistanceDeliveries: (...args: any) => void
  requestGetStateDeliveries: (...args: any) => void
  requestGetCitiesDeliveries: (...args: any) => void
  requestGetNeighborhoodsDeliveries: (...args: any) => void
  requestAddNeighborhoodDeliveries: (...args: any) => void
}

// Create context
const context = createContext({} as StoreDeliveryContextData)

export default context

const { Provider, Consumer } = context
// Export consumer
export const StoreDeliveryConsumer = Consumer

export class StoreDeliveryProvider extends BaseContextProvider {
  state: StoreDeliveryContextState = {
    deliveryFees: [],
    distanceDeliveryFees: [],
    states: [],
    cities: [],
    neighborhoods: [],
    neighborhood: null,
    fetching: false,
    deletedId: null,
  }

  requestGetStoreDeliveries = async (id?: string, page?: any, limit?: any, query?: string) => {
    this.startRequest(BaseApi)
    const response = await getStoreDeliveries(id, page, limit, query)
    this.processResponse(response, ['deliveryFees'])
  }

  requestGetStoreDistanceDeliveries = async () => {
    this.startRequest(BaseApi)
    const response = await getStoreDistanceDeliveries()
    this.processResponse(response, ['distanceDeliveryFees'])
  }

  requestSaveStoreDeliveries = async (data: any) => {
    this.startRequest(BaseApi)
    const response = await saveStoreDeliveries(data)
    this.processResponse(response, ['deliveryFees'])
  }

  requestSaveStoreDistanceDeliveries = async (data: any) => {
    this.startRequest(BaseApi)
    const response = await saveStoreDistanceDeliveries(data)
    this.processResponse(response, ['distanceDeliveryFees'])
  }

  requestDeleteStoreDeliveries = async (data?: any) => {
    this.startRequest(BaseApi)
    const response = await deleteStoreDeliveries({ deliveries: data })
    this.processResponse(response, ['deletedId'])
  }
  requestDeleteStoreDistanceDeliveries = async (data?: any) => {
    this.startRequest(BaseApi)
    const response = await deleteStoreDistanceDeliveries({ deliveries: data })
    this.processResponse(response, ['deletedId'])
  }

  requestGetStateDeliveries = async (id?: string) => {
    this.startRequest(BaseApi)
    const response = await getStateDeliveries(id)
    this.processResponse(response, ['states'])
  }
  requestGetCitiesDeliveries = async (id?: string) => {
    this.startRequest(BaseApi)
    const response = await getCitiesDeliveries(id)
    this.processResponse(response, ['cities'])
  }

  requestGetNeighborhoodsDeliveries = async (id?: string) => {
    this.startRequest(BaseApi)
    const response = await getNeighborhoodsDeliveries(id)
    this.processResponse(response, ['neighborhoods'])
  }

  requestAddNeighborhoodDeliveries = async (data: any) => {
    this.startRequest(BaseApi)
    const response = await addNeighborhood(data)
    this.processResponse(response, ['neighborhood'])
  }

  render() {
    const { children } = this.props

    return (
      <Provider
        value={{
          ...this.state,
          requestGetStoreDeliveries: this.requestGetStoreDeliveries,
          requestGetStoreDistanceDeliveries: this.requestGetStoreDistanceDeliveries,
          requestSaveStoreDeliveries: this.requestSaveStoreDeliveries,
          requestSaveStoreDistanceDeliveries: this.requestSaveStoreDistanceDeliveries,
          requestDeleteStoreDeliveries: this.requestDeleteStoreDeliveries,
          requestDeleteStoreDistanceDeliveries: this.requestDeleteStoreDistanceDeliveries,
          requestGetStateDeliveries: this.requestGetStateDeliveries,
          requestGetCitiesDeliveries: this.requestGetCitiesDeliveries,
          requestGetNeighborhoodsDeliveries: this.requestGetNeighborhoodsDeliveries,
          requestAddNeighborhoodDeliveries: this.requestAddNeighborhoodDeliveries,
        }}
      >
        {children}
      </Provider>
    )
  }
}
