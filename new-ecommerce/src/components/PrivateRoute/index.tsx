import React, { useContext } from "react"
import { Navigate } from "react-router"
import AuthContext from "../../contexts/auth.context"

export const PrivateRoute: React.FC = ({ children }) => {
  const { user } = useContext(AuthContext)

  return user ? <React.Fragment>{children}</React.Fragment> : <Navigate to="/login" />
}
