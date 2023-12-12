import { authApi, siteApi } from '../../config/api'
import { getUserToken } from '../../helpers/loggedUser'
import User from '../../interfaces/user'
import { PostUser, PostCustomer, PostRecoverPassword } from './request.interface'
import { GetUser, PostFindAccount } from './response.interface'

export async function loginWithGoogle(code: string) {
  return authApi.post<GetUser>(`/v1/customer/google/callback`, { code }).then((res) => res.data)
}

export async function loginWithFacebook(code: string) {
  return authApi.post<GetUser>(`/v1/customer/facebook/callback`, { code }).then((res) => res.data)
}

export async function findEmail(email: string) {
  return authApi.post<PostFindAccount>('/v1/customer/login/email', { email })
}

export async function loginWithEmail(email: string, password: string) {
  return authApi.post<GetUser>('/v1/customer/session', { email, password }).then((res) => res.data)
}

export async function renewToken() {
  const token = getUserToken()
  return authApi
    .get<GetUser>(
      `/v1/customer/renew/refresh`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((res) => res.data)
}

export async function updateUser(body: PostUser) {
  return siteApi.post<User>('/v2/customer/', body)
}

export async function registerCustomer(body: PostCustomer) {
  return authApi.post<GetUser>('/v1/customer/register', body)
}

export async function forgotPassword(email: string) {
  return authApi.post(`/v1/customer/login/recover`, { email })
}

export async function recoverPassword({ token, password }: PostRecoverPassword) {
  return authApi.post(`/v1/customer/login/reset-password/${token}`, { password })
}
