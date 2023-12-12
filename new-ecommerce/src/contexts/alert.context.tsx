import { Alert, Snackbar, Typography } from '@mui/material'
import React, { createContext, useEffect, useState } from 'react'

interface AlertProps {
  open: boolean
  message: string
  severity: 'error' | 'info' | 'success' | 'warning'
}

interface AlertContextData {
  alert: AlertProps
  setAlert: React.Dispatch<React.SetStateAction<AlertProps>>
}

const AlertContext = createContext({} as AlertContextData)
const { Provider } = AlertContext

export default AlertContext

export const AlertProvider: React.FC = ({ children }) => {
  const [alert, setAlert] = useState<AlertProps>({
    open: false,
    message: '',
    severity: 'info',
  })

  useEffect(() => {
    if (alert.open) {
      const timer = setTimeout(() => {
        setAlert((value) => ({
          ...value,
          open: false,
        }))
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [alert.open])

  const onClose = () => {
    setAlert((oldValue) => ({
      ...oldValue,
      open: false,
    }))
  }

  const { open, message, severity } = alert

  return (
    <Provider value={{ alert, setAlert }}>
      <Snackbar
        sx={{ top: { xs: 120 } }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={open}
      >
        <Alert variant="filled" severity={severity} onClose={onClose}>
          <Typography color="inherit" fontSize={14}>
            {message}
          </Typography>
        </Alert>
      </Snackbar>
      {children}
    </Provider>
  )
}
