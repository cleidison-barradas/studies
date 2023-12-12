import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import styles from './style'

type Props = {
  classes: any,
  title: string,
  text: string,
  onAccept: (...args: any) => void,
  onDecline: (...args: any) => void,
  open: boolean,
  acceptText?: string,
  declineText?: string,
  onClose: (...args: any) => void
}

class CustomConfirmDialog extends Component<Props>{

  render() {
    const { classes, open, title, onAccept, onDecline, text, acceptText, declineText, onClose } = this.props
    return (
      <div>
        <Dialog
          open={open}
          onClose={onClose}
        >
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <DialogContentText classes={{
              root : classes.dialogcontexttext
            }} >
              {
                text
              }
            </DialogContentText>
          </DialogContent>
          <DialogActions
            classes={{
              root : classes.actions
            }}
          >
            <Button autoFocus onClick={onDecline} classes={{
              root: classes.cancelbtn
            }}>
              {declineText ? declineText : 'Cancelar'}
            </Button>
            <Button onClick={onAccept} classes={{
              root: classes.acceptbtn
            }} autoFocus>
              {acceptText ? acceptText : 'Aceitar'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default withStyles(styles)(CustomConfirmDialog)