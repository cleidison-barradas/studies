import { useContext } from 'react'
import { setAccessToken } from '../config/api'
import AuthContext from '../contexts/auth.context'
import { updateUser, registerCustomer } from '../services/customer/customer.service'
import { PostUser, PostCustomer } from '../services/customer/request.interface'

export const useUser = () => {
  const { setUser } = useContext(AuthContext)

  const UpdateUser = async ({ firstname, lastname, cpf, phone, email }: PostUser) => {
    const response = await updateUser({ firstname, lastname, cpf, phone, email })
    if (response.ok && response.data) setUser(response.data)
    return response
  }

  const RegisterUser = async (data: PostCustomer) => {
    const response = await registerCustomer(data)
    if (response.ok && response.data) {
      setAccessToken(response.data.accessToken)
      localStorage.setItem(
        '@myp/auth',
        JSON.stringify({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        })
      )
      setUser(response.data.user)
    }
    return response
  }

  return {
    UpdateUser,
    RegisterUser,
  }
}
