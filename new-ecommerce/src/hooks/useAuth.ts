import { useCallback, useContext } from 'react'
import { mutate } from 'swr'
import { setAccessToken } from '../config/api'
import AuthContext from '../contexts/auth.context'
import User from '../interfaces/user'
import {
  loginWithFacebook,
  loginWithGoogle,
  loginWithEmail,
  renewToken,
  findEmail,
} from '../services/customer/customer.service'

export const useAuth = () => {
  const { setUser, store, user } = useContext(AuthContext)

  const handleLogInUser = (data: User, accessToken: string, refreshToken: string) => {
    setAccessToken(accessToken)
    localStorage.setItem('@myp/auth', JSON.stringify({ refreshToken }))
    setUser(data)
  }

  const FacebookLogin = async (code: string) => {
    const response = await loginWithFacebook(code)
    if (response) handleLogInUser(response.user, response.accessToken, response.refreshToken)

    return response
  }

  const GoogleLogin = async (code: string) => {
    const response = await loginWithGoogle(code)
    if (response) handleLogInUser(response.user, response.accessToken, response.refreshToken)
    return response
  }

  const FindAccount = async (email: string) => {
    const response = await findEmail(email)

    return response
  }

  const EmailLogin = async (email: string, password: string) => {
    const response = await loginWithEmail(email, password)
    if (response) handleLogInUser(response.user, response.accessToken, response.refreshToken)
    return response
  }

  const logout = () => {
    localStorage.removeItem('@myp/auth')
    mutate('startup')
    setUser(null)
  }

  const renewUserToken = useCallback(async () => {
    const response = await renewToken()
    if (response?.accessToken) {
      setAccessToken(response.accessToken)
      localStorage.setItem('@myp/auth', JSON.stringify({ refreshToken: response.refreshToken }))
      return response
    }
  }, [])

  return {
    EmailLogin,
    GoogleLogin,
    FacebookLogin,
    logout,
    renewUserToken,
    store,
    user,
    FindAccount,
  }
}
