import React, { Component } from 'react'
import { Button, Typography, withStyles } from '@material-ui/core'
import styles from './styles'
import CustomDialog from '../CustomDialog'
import { ReactComponent as GoToIcon } from '../../assets/images/blueGoTo.svg'
import ImportPromotionModalContent from '../ImoportPromotionModalContent'
import { FormikErrors } from 'formik'
import { PutImportPromotion } from '../../services/api/interfaces/ApiRequest'

interface Props {
  open: boolean
  errors: FormikErrors<PutImportPromotion>
  closeModal: () => void
  onSave: (data: any) => void
  openSnackbar: (message: string, severity?: 'error' | 'info' | 'success' | 'warning') => void
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class ImportPromotionModal extends Component<Props> {
  _renderFooter = () => {
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
  _renderContent = () => {
    const { errors } = this.props
    return <ImportPromotionModalContent errors={errors} />
  }

  render() {
    const { closeModal, open } = this.props
    return (
      <CustomDialog
        open={open}
        closeModal={closeModal}
        footer={this._renderFooter}
        content={this._renderContent}
        title="Importar preços de produtos como promoções"
      />
    )
  }
}

export default withStyles(styles)(ImportPromotionModal)
