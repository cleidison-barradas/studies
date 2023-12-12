import React, { useContext } from 'react'
import AuthContext from '../../context/AuthContext'

export const LayoutHide: React.FC = ({ children }) => {
  const { store } = useContext(AuthContext)
  return <React.Fragment>{store?.settings.config_new_layout === true && children}</React.Fragment>
}
