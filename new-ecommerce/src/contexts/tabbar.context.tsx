import React, { createContext, useState } from 'react'
import { TabBar } from '../components/TabBar'

interface TabBarContextData {
  hidden: boolean
  hideTabbar: React.Dispatch<React.SetStateAction<boolean>>
}

const TabBarContext = createContext({} as TabBarContextData)
const { Provider } = TabBarContext

export default TabBarContext

export const TabBarProvider: React.FC = ({ children }) => {
  const [hidden, hideTabbar] = useState(false)

  return (
    <Provider value={{ hidden, hideTabbar }}>
      {children}
      {hidden === false && <TabBar />}
    </Provider>
  )
}
