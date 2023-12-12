import React, { createContext, useState } from 'react'

interface LayoutContextData {
  isHeaderHidden: boolean
  isFooterHidden: boolean
  isContainerHidden: boolean
  setisFooterHidden: React.Dispatch<React.SetStateAction<boolean>>
  setisHeaderHidden: React.Dispatch<React.SetStateAction<boolean>>
  setisContainerHidden: React.Dispatch<React.SetStateAction<boolean>>
}

export const LayoutContext = createContext({} as LayoutContextData)
const { Provider } = LayoutContext

export const LayoutProvider: React.FC = ({ children }) => {
  const [isHeaderHidden, setisHeaderHidden] = useState(false)
  const [isFooterHidden, setisFooterHidden] = useState(false)
  const [isContainerHidden, setisContainerHidden] = useState(false)

  return (
    <Provider
      value={{
        isHeaderHidden,
        isFooterHidden,
        setisFooterHidden,
        setisHeaderHidden,
        isContainerHidden,
        setisContainerHidden,
      }}
    >
      {children}
    </Provider>
  )
}
