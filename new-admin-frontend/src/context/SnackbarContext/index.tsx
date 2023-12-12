import React, { createContext } from 'react'
import { IconButton, Snackbar, Typography } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import Alert from '@material-ui/lab/Alert'

interface ContextState {
  open: boolean
  message: string
  severity: 'error' | 'info' | 'success' | 'warning'
}

interface ContextData extends ContextState {
  openSnackbar: (message: string, severity?: 'error' | 'info' | 'success' | 'warning') => void
}

const snackbarContext = createContext({} as ContextData)
export default snackbarContext
const { Provider, Consumer } = snackbarContext

export const SnackbarConsumer = Consumer

export class SnackbarProvider extends React.Component<{}, ContextState> {
  state: ContextState = {
    open: false,
    message: '',
    severity: 'info',
  }

  handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    this.setState({
      ...this.state,
      open: false,
    })
  }

  openSnackbar = (message: string, severity: 'error' | 'info' | 'success' | 'warning' = 'success') => {
    this.setState({
      message,
      severity,
      open: true,
    })
  }

  render() {
    const { children } = this.props
    const { open, message, severity } = this.state
    return (
      <Provider
        value={{
          ...this.state,
          openSnackbar: this.openSnackbar,
        }}
      >
        <>
          <Snackbar
            open={open}
            autoHideDuration={4000}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            onClose={this.handleClose}
          >
            <Alert
              severity={severity}
              action={
                <IconButton onClick={this.handleClose}>
                  <Close />
                </IconButton>
              }
              elevation={3}
            >
              <Typography color="inherit"> {message} </Typography>
            </Alert>
          </Snackbar>
          {children}
        </>
      </Provider>
    )
  }
}

export function withSnackbar<P extends object>(Component: React.ComponentType<P>) {
  return class WithSnackbar extends React.Component<P & { openSnackbar: ContextData['openSnackbar'] }> {
    render() {
      return (
        <SnackbarProvider>
          <SnackbarConsumer>
            {({ openSnackbar }) => <Component {...(this.props as P)} openSnackbar={openSnackbar} />}
          </SnackbarConsumer>
        </SnackbarProvider>
      )
    }
  }
}
