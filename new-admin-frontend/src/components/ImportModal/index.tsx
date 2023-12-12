import { Button, Typography, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import styles from './style'
import CustomDialog from '../CustomDialog'
import { ReactComponent as GoToIcon } from '../../assets/images/blueGoTo.svg'
import ImportModalContent from '../ImportModalContent'
import style from './style'



type Props = {
  classes: Record<keyof ReturnType<typeof styles>, string>
  open: boolean
  closeModal: () => void
  onSave: (data: any) => void
  openSnackbar: (message: string, severity?: 'error' | 'info' | 'success' | 'warning') => void
}

class ImportModal extends Component<Props> {

  footer = () => {
    const { classes, closeModal, onSave } = this.props

    return (
      <div className={classes.footer}>
        <a
          href="https://mypharmasupport.zendesk.com/hc/pt-br/search?utf8=%E2%9C%93&query=importador+de+produtos"
          target="_blank"
          rel="noopener noreferrer"
          className={classes.link}
        >
          <GoToIcon fill={'#ccc'} />
          <Typography color="inherit">Precisa de ajuda?</Typography>
        </a>
        <div className={classes.btngroup}>
          <Button variant="outlined" onClick={closeModal}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={onSave}>
            Salvar
          </Button>
        </div>
      </div>
    )
  }

  content = () => {
    return <ImportModalContent />
  }

  render() {
    const { closeModal, open } = this.props

    return (
      <CustomDialog
        open={open}
        footer={this.footer}
        content={this.content}
        closeModal={closeModal}
        title="Importar produtos por arquivo .XLS"
      />
    )
  }
}

export default withStyles(style)(ImportModal)
