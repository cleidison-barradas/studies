import React, { createContext, useState } from 'react'

interface MenuContextData {
  open: boolean
  setOpen: (open: boolean) => void
}

const MenuContext = createContext({} as MenuContextData)
const { Provider } = MenuContext

export const MenuProvider: React.FC = ({ children }) => {
  const [open, setOpen] = useState(false)

  return <Provider value={{ open, setOpen }}>{children}</Provider>
}

export default MenuContext
