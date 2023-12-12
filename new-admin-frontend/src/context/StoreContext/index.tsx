import React, { createContext } from 'react'
import { BaseContextState, BaseContextProvider } from '../BaseContext'
import { getStoreInfo, addStoreSettings, getStoreGroups, getStoreList, addStoreUrls, addStoreGroup, getStoreUrls, deleteStoreGroup, getIntegrationModule, putSettingsEpharma, getExternalIntegrationData, putExternalIntegrationData } from '../../services/api'
import Store from '../../interfaces/store'
import Settings from '../../interfaces/storeSettings'
import { BaseApi } from '../../config'
import StoreGroup from '../../interfaces/storeGroups'
import StoreUrls from '../../interfaces/storeUrls'
import IntegrationModule from '../../interfaces/integrationModule'
import { EpharmaRequest } from '../../services/api/interfaces/ApiRequest'
import SnackbarContext from '../SnackbarContext'

export const TENANT_KEY = '@myp-admin/tenant'

interface StoreContextState extends BaseContextState {
  store?: Store
  settings: Settings | null
  stores: Store[]
  groups: StoreGroup[]
  storeUrls: StoreUrls[]
  module: IntegrationModule | null
  externalIntegrationData: any
}

export interface StoreContextData extends StoreContextState {
  requestgetStore: (...args: any) => Promise<void>
  requestaddSettings: (...args: any) => Promise<void>
  requestGetStoreList: (...args: any) => void
  requestGetStoreUrls: (...args: any) => void
  requestAlterStoreUrls: (...args: any) => void
  requestAddStoreGroup: (...args: any) => void
  requestGetStoreGroups: (...args: any) => void
  requestDeleteStoreGroup: (...args: any) => void
  requestGetIntegrationModule: (...args: any) => void
  requestAddEpharmaSettings: (...args: any) => void
  getExternalIntegrationData: (...args: any) => void
  putExternalIntegrationData: (...args: any)=>void
}

// Create context
const context = createContext({} as StoreContextData)
export default context
const { Provider, Consumer } = context
// Export consumer
export const StoreConsumer = Consumer

export class StoreProvider extends BaseContextProvider {
  static contextType = SnackbarContext
  context!: React.ContextType<typeof SnackbarContext>

  state: StoreContextState = {
    settings: null,
    success: false,
    stores: [],
    groups: [],
    storeUrls: [],
    module: null,
    externalIntegrationData: {} || null
  }

  componentDidMount() {
    this.startRequest(BaseApi)
    this.requestgetStore()
  }

  requestgetStore = async () => {
    await this.startRequest(BaseApi)
    const response = await getStoreInfo()
    this.processResponse(response, ['store'])
  }

  requestaddSettings = async (data: any) => {
    await this.startRequest(BaseApi)
    const response = await addStoreSettings(data)
    this.processResponse(response, ['store'])
  }

  requestGetStoreGroups = async () => {
    await this.startRequest(BaseApi)
    const response = await getStoreGroups()
    this.processResponse(response, ['groups'])
  }
  requestGetStoreList = async () => {
    await this.startRequest(BaseApi)
    const response = await getStoreList()
    this.processResponse(response, ['stores'])
  }

  requestAlterStoreUrls = async (data: any) => {
    await this.startRequest(BaseApi)
    const response = await addStoreUrls(data)
    this.processResponse(response, ['storeUrls'])
  }

  requestAddStoreGroup = async (data: any) => {
    await this.startRequest(BaseApi)
    const response = await addStoreGroup(data)
    this.processResponse(response, ['group'])
  }

  requestGetStoreUrls = async () => {
    await this.startRequest(BaseApi)
    const response = await getStoreUrls()
    this.processResponse(response, ['storeUrls'])
  }

  requestDeleteStoreGroup = async (groupId: string) => {
    await this.startRequest(BaseApi)
    const response = await deleteStoreGroup(groupId)
    this.processResponse(response, ['deletedId'])
  }

  requestGetIntegrationModule = async (code?: string) => {
    await this.startRequest(BaseApi)
    const response = await getIntegrationModule(code)
    this.processResponse(response, ['module'])
  }

  requestGetExternalIntegrationData = async(integration:string)=>{
    await this.startRequest(BaseApi)
    const response = await getExternalIntegrationData(integration)
    console.log(response)
    this.processResponse(response, ['externalIntegrationData'])
  }

  requestPutExternalIntegrationData = async(integration: string, data: {}) => {
    await this.startRequest(BaseApi)
    const response = await putExternalIntegrationData(integration, data)
    console.log(response)
    this.processResponse(response, ['externalIntegrationData'])
  }

  requestAddEpharmaSettings = async ({ config_epharma_clientId, config_epharma_password, config_epharma_username }: EpharmaRequest) => {
    await this.startRequest(BaseApi)
    const response = await putSettingsEpharma({ config_epharma_clientId, config_epharma_password, config_epharma_username })

    this.processResponse(response, ['config_epharma_clientId', 'config_epharma_password', 'config_epharma_username'])

    if (response.ok) {
      const { openSnackbar } = this.context
      openSnackbar('Credenciais salvas com sucesso!', 'success')
    }
  }

  render() {
    const { children } = this.props
    return (
      <Provider
        value={{
          ...this.state,
          requestgetStore: this.requestgetStore,
          requestaddSettings: this.requestaddSettings,
          requestGetStoreList: this.requestGetStoreList,
          requestGetStoreUrls: this.requestGetStoreUrls,
          requestAddStoreGroup: this.requestAddStoreGroup,
          requestGetStoreGroups: this.requestGetStoreGroups,
          requestAlterStoreUrls: this.requestAlterStoreUrls,
          requestDeleteStoreGroup: this.requestDeleteStoreGroup,
          requestGetIntegrationModule: this.requestGetIntegrationModule,
          requestAddEpharmaSettings: this.requestAddEpharmaSettings,
          getExternalIntegrationData: this.requestGetExternalIntegrationData,
          putExternalIntegrationData: this.requestPutExternalIntegrationData
        }}
      >
        {children}
      </Provider>
    )
  }
}
