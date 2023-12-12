import React, { useEffect, useState } from 'react'
import { CookiesPopup } from '../components/CookiesPopup'

interface CookieContextData {
  isAllowed: boolean
  allowCookies: () => void
  initialized: boolean
  setInitialized: React.Dispatch<React.SetStateAction<boolean>>
}

const cookieContext = React.createContext({} as CookieContextData)
const { Provider } = cookieContext

export const CookieProvider: React.FC = ({ children }) => {
  const [isAllowed, setIsAllowed] = useState<boolean>(false)
  const [initialized, setInitialized] = useState(false)

  const allowCookies = () => {
    setIsAllowed(true)
    localStorage.setItem('isCookiesAllowed', 'true')
  }

  useEffect(() => {
    const storagedOption = localStorage.getItem('isCookiesAllowed')
    if (storagedOption === 'true') {
      setIsAllowed(true)
    }
  }, [])

  return (
    <Provider value={{ isAllowed, allowCookies, initialized, setInitialized }}>
      {isAllowed === false && <CookiesPopup />} {children}
    </Provider>
  )
}

export default cookieContext
