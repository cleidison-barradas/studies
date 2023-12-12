import { useContext } from 'react'
import AlertContext from '../contexts/alert.context'

export const useAlert = () => {
  const { setAlert } = useContext(AlertContext)

  const showMessage = (message: string, severity: 'error' | 'info' | 'success' | 'warning') => {
    setAlert({
      open: true,
      message,
      severity,
    })
  }

  return { showMessage }
}
