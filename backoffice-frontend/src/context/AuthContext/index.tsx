import React, { createContext } from 'react'
import { BaseContextState, BaseContextProvider } from '../BaseContext'
import { clearStorage, loadStorage, saveStorage } from '../../services/storage'
import { setToken, sessionRequest, refreshSession } from '../../services/api'
import { AuthApi } from '../../config'
import { UserSessionRequest } from '../../services/api/interfaces/ApiRequest'

export const STORAGE_KEY = '@myp-admin/auth'
export const USER_KEY = '@myp-admin/user'

interface AuthContextState extends BaseContextState {
    loggedIn: boolean
    accessToken: string | null
    refreshToken: string | null
    user: any | null
}

interface AuthContextData extends AuthContextState {
    resetErrors: () => void
    requestSession: (payload: UserSessionRequest) => Promise<void>
    refreshSession: () => Promise<void>
    logout: () => void
}

// Create context
const authContext = createContext({} as AuthContextData)
export default authContext
const { Provider, Consumer } = authContext
// Export consumer
export const AuthConsumer = Consumer

export class AuthProvider extends BaseContextProvider {
    state: AuthContextState = {
        loggedIn: false,
        accessToken: null,
        refreshToken: null,
        user: null,
    }

    constructor(props: any) {
        super(props)

        const tokens = loadStorage(STORAGE_KEY)
        const user = loadStorage(USER_KEY)
        // We do have stored user data?
        if (tokens) {
            this.state = {
                ...this.state,
                ...tokens,
                user,
            }
        }
        this.logout = this.logout.bind(this)
    }

    requestSession = async (payload: UserSessionRequest) => {
        await this.startRequest(AuthApi)
        const response = await sessionRequest(payload)
        const { ok, data } = response
        const { refreshToken, accessToken, user } = data

        this.processResponse(response, ['accessToken', 'refreshToken', 'user'])

        if (ok) {
            saveStorage(USER_KEY, user)
            saveStorage(STORAGE_KEY, { accessToken, refreshToken })
            setToken(accessToken)

            this.setState({
                ...this.state,
                loggedIn: true,
            })

            this.showMessage('Autênticado com successo', 'success')
        }
    }

    refreshSession = async () => {
        await this.startRequest(AuthApi)
        const { refreshToken } = this.state
        if (!refreshToken) {
            return
        }
        const response = await refreshSession(refreshToken)
        const { ok, data } = response
        const { accessToken } = data

        this.processResponse(response, ['accessToken', 'refreshToken', 'user'])
        if (ok) {
            saveStorage(USER_KEY, response.data.user)
            saveStorage(STORAGE_KEY, { accessToken, refreshToken: data.refreshToken })
            setToken(response.data.accessToken)

            this.setState({
                ...this.state,
                ...data,
                loggedIn: true,
            })
            this.showMessage('Autênticado com successo', 'success')
        } else {
            this.logout()
        }
    }

    logout() {
        this.setState({
            ...this.state,
            error: false,
            errorObjects: null,
            accessToken: '',
            refreshToken: '',
            loggedIn: false,
            user: null,
        })
        clearStorage(STORAGE_KEY)
    }

    async componentDidMount() {
        const { refreshToken } = this.state
        if (refreshToken) await this.refreshSession()
    }

    render() {
        const { children } = this.props
        return (
            <Provider
                value={{
                    ...this.state,
                    requestSession: this.requestSession,
                    resetErrors: this.resetErrors,
                    logout: this.logout,
                    refreshSession: this.refreshSession,
                }}
            >
                {children}
            </Provider>
        )
    }
}
