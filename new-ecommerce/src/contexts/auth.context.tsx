import React, { createContext, useEffect, useState } from 'react'
import User from '../interfaces/user'
import useSwr from 'swr'
import { startup } from '../services/store/store.service'
import Store from '../interfaces/store'
import { setAccessToken } from '../config/api'
import { getUserToken } from '../helpers/loggedUser'
import { useAuth } from '../hooks/useAuth'
import { ISender } from '../interfaces/sender'
import { createTracker } from '@elastic/behavioral-analytics-javascript-tracker'

interface AuthContextData {
  user: User | null
  sender: ISender
  isStarted: boolean
  store: Store | null
  setUser: (user: User | null) => void
  setSender: React.Dispatch<React.SetStateAction<ISender>>
}

const AuthContext = createContext({} as AuthContextData)
const { Provider } = AuthContext

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isStarted, setisStarted] = useState<boolean>(false)
  const [sender, setSender] = useState<ISender>('not_selected')

  const { renewUserToken } = useAuth()
  const { data, error } = useSwr('startup', startup, { revalidateOnFocus: false })

  const store = data ? data.store : null

  const companySender: ISender = store && store.settings['config_shipping_courier'] ? 'courier' : store && store.settings['config_best_shipping'] ? 'bestshipping' : 'not_selected'

  useEffect(() => {
    if (data && !error) {
      const token = getUserToken()
      setAccessToken(data.accessToken)
      setisStarted(true)

      createTracker({
        apiKey: process.env.REACT_APP_ELASTIC_API_KEY || '',
        endpoint: process.env.REACT_APP_ELASTIC_ENDPOINT || '',
        collectionName: `mongo-search-tracking-production`
      })

      if (token) {
        renewUserToken().then((value) => {
          if (value?.accessToken && value.user) {
            setUser(value?.user)
            setAccessToken(value!.accessToken)

          } else {
            localStorage.removeItem('@myp/auth')
            setUser(null)
          }
        })
      }
    }

    if (!companySender.includes('not_selected')) {
      setSender(companySender)
    }
  }, [data, error, companySender, renewUserToken])

  return (
    <Provider
      value={{
        user,
        store,
        sender,
        isStarted,
        setUser,
        setSender
      }}
    >
      {children}
    </Provider>
  )
}

export default AuthContext
