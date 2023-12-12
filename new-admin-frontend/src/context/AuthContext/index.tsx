import React, { createContext } from 'react'
import { RouteComponentProps } from 'react-router'
import { BaseContextState, BaseContextProvider } from '../BaseContext'

import CustomerxService from '../../services/customerx.service'
import { clearStorage, loadStorage, saveStorage } from '../../services/storage'
import { setToken, sessionRequest, userTenantList, userSetTenant, refreshSession } from '../../services/api'
import STORAGE_KEYS from '../../services/storageKeys'
import { AuthApi } from '../../config'
import hash256 from '../../helpers/hash256'

import Store from '../../interfaces/store'
import Tenant from '../../interfaces/tenant'
import { IUser } from '../../interfaces/user'
import Credential from '../../interfaces/credential'
import { IStorageTenant } from '../../interfaces/storageTenant'
import { IStorageAuth } from '../../interfaces/storageAuth'

interface Props {
  history: RouteComponentProps['history']
}

interface AuthContextState extends BaseContextState {
  loggedIn: boolean
  tenants: Tenant[]
  user: IUser | null
  store: Store | null
  accessToken: string
  refreshToken: string
  tenant: IStorageTenant | null
  initialLocation: string
  refreshingSession: boolean
}

interface AuthContextData extends AuthContextState {
  logout: () => void
  resetTenant: () => void
  refreshSession: () => Promise<void>
  requestUserTenantList: () => Promise<void>
  requestSession: (data: Credential) => Promise<void>
  requestUserSetTenant: (tenant: Tenant) => Promise<void>
}

// Create context
const context = createContext({} as AuthContextData)
export default context
const { Provider, Consumer } = context
// Export consumer
export const AuthConsumer = Consumer

export class AuthProvider extends BaseContextProvider<Props> {
  state: AuthContextState = {
    loggedIn: false,
    accessToken: '',
    refreshToken: '',
    user: null,
    fetching: false,
    success: false,
    error: null,
    errorObjects: null,
    deletedId: null,
    pagination: null,
    tenants: [],
    tenant: null,
    store: null,
    initialLocation: '/',
    refreshingSession: false,
  }

  constructor(props: any) {
    super(props)

    const auth = loadStorage<IStorageAuth>(STORAGE_KEYS.AUTH_KEY)
    const tenant = loadStorage<IStorageTenant>(STORAGE_KEYS.TENANT_KEY)
    // We do have stored user data?
    if (auth && tenant) {
      this.state = {
        ...this.state,
        ...auth,
        tenant
      }
    }
  }

  requestSession = async (data: Credential) => {
    await this.startRequest(AuthApi)
    const { history } = this.props
    const response = await sessionRequest(data)
    const { ok } = response
    this.processResponse(response, ['accessToken', 'refreshToken', 'user'])
    if (ok) {
      await this.requestUserTenantList()
      saveStorage(STORAGE_KEYS.USER_KEY, response.data.user)
      history.replace('/tenant')
    }
  }

  refreshSession = async () => {
    await this.startRequest(AuthApi)
    const { refreshToken, accessToken } = this.state

    this.setState({
      refreshingSession: true,
    })

    const response = await refreshSession(refreshToken)

    this.processResponse(response, ['accessToken', 'refreshToken', 'user'])
    const { ok, data } = response

    if (ok) {
      saveStorage(STORAGE_KEYS.USER_KEY, data.user)
      this.showMessage('Usúario autenticado com sucesso', 'success')

      setToken(accessToken)

      const tenant = loadStorage<IStorageTenant>(STORAGE_KEYS.TENANT_KEY)

      if (tenant) {
        await this.requestUserSetTenant(tenant)
      }
    } else {
      this.logout()
    }

    this.setState({
      refreshingSession: false,
    })
  }

  requestUserTenantList = async () => {
    await this.startRequest(AuthApi)
    const response = await userTenantList()
    this.processResponse(response, ['tenants'])
  }

  requestUserSetTenant = async (tenant: IStorageTenant) => {
    await this.startRequest(AuthApi)
    const response = await userSetTenant(tenant._id)
    this.processResponse(response, ['accessToken', 'refreshToken', 'store'])
    const {
      ok,
      data: { store },
    } = response
    if (ok) {
      this.setState({
        ...this.state,
        loggedIn: true,
        tenant,
        store,
      })
      saveStorage(STORAGE_KEYS.TENANT_KEY, tenant)
      saveStorage(STORAGE_KEYS.AUTH_KEY, response.data)

      const {
        settings: { config_cx_email, config_cx_id },
      } = store

      const hash = hash256(config_cx_id, config_cx_email)

      CustomerxService.start(config_cx_id, config_cx_email)
      CustomerxService.startTracking(hash)
      CustomerxService.sendUserTracking()
    }
  }

  resetTenant = () => {
    const { history } = this.props

    this.setState(
      {
        ...this.state,
        loggedIn: false,
        tenant: null,
        store: null,
      },
      () => history.replace('/tenant')
    )
  }

  logout = () => {
    const { history } = this.props
    this.setState({
      ...this.state,
      accessToken: '',
      refreshToken: '',
      loggedIn: false,
      tenant: null,
      user: null,
      tenants: [],
      store: null,
    })
    clearStorage(STORAGE_KEYS.AUTH_KEY)
    clearStorage(STORAGE_KEYS.TENANT_KEY)

    CustomerxService.stop()

    history.replace('/')
  }

  async componentDidMount() {
    const { accessToken } = this.state
    const { history } = this.props

    if (accessToken && accessToken.length > 0) {
      setToken(accessToken)
      await this.refreshSession()
      await this.requestUserTenantList()
    } else {
      if (window.location.pathname !== '/change/password') history.replace('/')
    }
  }

  render() {
    const { children } = this.props

    return (
      <Provider
        value={{
          ...this.state,
          logout: this.logout,
          resetTenant: this.resetTenant,
          requestSession: this.requestSession,
          refreshSession: this.refreshSession,
          requestUserSetTenant: this.requestUserSetTenant,
          requestUserTenantList: this.requestUserTenantList,
        }}
      >
        {children}
      </Provider>
    )
  }
}
