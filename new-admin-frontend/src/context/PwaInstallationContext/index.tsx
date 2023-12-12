import { createContext } from 'react'
import { BaseApi } from '../../config'
import {
  getPwaInstallations} from '../../services/api'
import OrderStatistics from '../../interfaces/orderStatistic'
import { BaseContextProvider, BaseContextState } from '../BaseContext'
import { loadStorage } from '../../services/storage'
import OrderStatus from '../../interfaces/orderStatus'
import Tracking from '../../interfaces/tracking'
import { IStorageTenant } from '../../interfaces/storageTenant'
import { IUser } from '../../interfaces/user'
import Store from '../../interfaces/store'

export const TENANT_KEY = '@myp-admin/tenant'
export const USER_KEY = '@myp-admin/user'

interface PwaInstallationContextState extends BaseContextState {
  installations: []
  statistics: OrderStatistics | null
  status: OrderStatus[]
  store: Store | null,
  tracking: Tracking[]
}

interface PwaInstallationContextData extends PwaInstallationContextState {
  getPwaInstallations: () => void
}

const PwaInstallationContext = createContext({} as PwaInstallationContextData)
export default PwaInstallationContext

const { Consumer, Provider } = PwaInstallationContext
export const PwaInstallationConsumer = Consumer

export class PwaInstallationProvider extends BaseContextProvider {
  state: PwaInstallationContextState = {
    installations: [],
    fetching: false,
    success: false,
    error: null,
    errorObjects: null,
    deletedId: null,
    pagination: null,
    statistics: null,
    status: [],
    store: null,
    tracking: []
  }

  componentDidMount() {
    const tenant = loadStorage<IStorageTenant>(TENANT_KEY)
    const user = loadStorage<IUser>(USER_KEY)

    if (tenant && user && user.store.length > 0) {
      const stores = user.store
      const store = stores.find(x => x._id?.includes(tenant._id))

      this.setState(state => ({
        ...state,
        store
      }))
    }
  }

  getPwaInstallations = async () => {
    this.startRequest(BaseApi)
    const response = await getPwaInstallations()
    this.processResponse(response)
    return response
  }

  render() {
    const { children } = this.props
    return (
      <Provider
        value={{
          ...this.state,
          getPwaInstallations: this.getPwaInstallations,
        }}
      >
        {children}
      </Provider>
    )
  }
}
