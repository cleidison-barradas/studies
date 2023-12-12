import React, { Component, createContext } from 'react'
import CustomConfirmDialog from '../../components/CustomConfirmDialog'


export interface DialogProps {
  onAccept: () => void,
  onClose?: () => void,
  onDecline: () => void,
  title: string,
  description: string,
}

interface ConfirmDialogContextState {
  open: boolean,
  onAccept: () => void,
  onDecline: () => void,
  onClose: () => void,
  title: string,
  description: string,
}

interface ConfirmDialogContextData extends ConfirmDialogContextState {
  openDialog: (props: DialogProps) => void,
  closeDialog: () => void,
}

const ConfirmDialogContext = createContext({} as ConfirmDialogContextData)
export default ConfirmDialogContext

const { Consumer, Provider } = ConfirmDialogContext
export const ConfirmDialogConsumer = Consumer

export class ConfirmDialogProvider extends Component {

  state: ConfirmDialogContextState = {
    open: false,
    onDecline: () => '',
    onAccept: () => '',
    onClose: () => '',
    title: '',
    description: ''
  }

  closeDialog = () => {
    this.setState({
      ...this.state,
      open: false
    })
  }

  openDialog = (props: DialogProps) => {
    this.setState({
      ...this.state,
      ...props,
      open: true,
    })
  }


  render() {
    const { children } = this.props
    const { onDecline, onAccept, open, description, title, onClose } = this.state
    const { openDialog, closeDialog } = this
    return (
      <Provider
        value={{
          ...this.state,
          openDialog,
          closeDialog
        }}
      >
        <CustomConfirmDialog
          onAccept={onAccept}
          onDecline={onDecline}
          onClose={onClose}
          open={open}
          title={title}
          text={description}
        />
        {children}
      </Provider>
    )
  }
}