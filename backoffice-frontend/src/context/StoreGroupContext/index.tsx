import React, { createContext } from 'react'
import { BaseApi } from '../../config'
import StoreGroup from '../../interfaces/storeGroup'
import { getStoreGroups } from '../../services/api'
import { GetStoreGroupsRequest } from '../../services/api/interfaces/ApiRequest'
import { BaseContextProvider, BaseContextState } from '../BaseContext'

interface ContextState extends BaseContextState {
    storeGroups: StoreGroup[]
    storeGroup?: StoreGroup
}

interface ContextData extends ContextState {
    getStoreGroups: () => Promise<void>
}

const context = createContext({} as ContextData)
export default context
const { Provider, Consumer } = context

export const StoreGroupConsumer = Consumer

export class StoreGroupProvider extends BaseContextProvider {
    state: ContextState = {
      storeGroups: [ ],
      storeGroup: {
        stores: [],
        _id: '6059e7af53294d466217a039',
        name: 'Grupo um',
        updatedAt: new Date('2021-03-23T13:05:51.631Z'),
        createdAt: new Date('2021-03-23T13:05:51.631Z')
      }
    }

    getStoreGroups = async (data?: GetStoreGroupsRequest) => {
      await this.startRequest(BaseApi)
      const response = await getStoreGroups(data)
      this.processResponse(response, ['storeGroups'])
    }

    render () {
      const { children } = this.props
      return (
            <Provider
                value={{
                  ...this.state,
                  getStoreGroups: this.getStoreGroups
                }}
            >
                {children}
            </Provider>
      )
    }
}
