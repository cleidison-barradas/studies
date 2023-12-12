import React, { Component } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography, withStyles } from '@material-ui/core'
import { IDialogContentType } from '../../interfaces/dialog'
import style from './style'

import { ReactComponent as CouponIcon } from '../../assets/images/icons/couponIogo.svg'

type Props = {
  classes: any
  open: boolean
  title?: string
  paperWidthSm?: any
  dividers?: boolean
  footer?: string | IDialogContentType
  content?: string | IDialogContentType
  closeModal: () => void
}

class CustomDialog extends Component<Props> {
  static defaultProps = {
    open: false,
    dividers: true,
  }

  render() {
    const { title, open = false, closeModal, content, footer, classes, dividers = true, paperWidthSm } = this.props
    return (
      <Dialog open={open} classes={{ paperWidthSm }} onClose={closeModal}>
        <div className={classes.dialogContainer}>
          <div className={classes.leftColumn}>
            {
              title === 'Alterar status do pedido' &&
              <CouponIcon />
            }
          </div>
          <div className={classes.rightColumn}>
            {title && (
              <DialogTitle className={classes.titleText} disableTypography={true}>
                {title}
              </DialogTitle>
            )}
            {content && (
              <DialogContent
                dividers={dividers && dividers}
                classes={{
                  root: dividers ? '' : classes.bordertop,
                }}
              >
                {typeof content === 'string' ? <Typography gutterBottom>{content}</Typography> : <React.Fragment>{content()}</React.Fragment>}
              </DialogContent>
            )}

            {footer && (
              <DialogActions
                classes={{
                  root: classes.actions,
                }}
              >
                {typeof footer === 'string' ? <Typography gutterBottom>{content}</Typography> : <React.Fragment>{footer()}</React.Fragment>}
              </DialogActions>
            )}
          </div>
        </div>
      </Dialog>
    )
  }
}

export default withStyles(style)(CustomDialog)