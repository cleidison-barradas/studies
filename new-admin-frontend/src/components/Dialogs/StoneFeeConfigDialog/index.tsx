import React, { Component } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Link,
  Typography,
  withStyles,
} from '@material-ui/core'

import StoneFlagsFeeForm from '../../Forms/StoneFlagsFeeForm'

import FileIcon from '../../../assets/images/fileIcon.svg'
import styles from './styles'

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

interface State {
  showFlagsFeeForm: boolean
}

class StoneFeeConfigDialog extends Component<Props, State> {

  state: State = {
    showFlagsFeeForm: false
  }

  handleSubmit = () => {
    const { onConfirm } = this.props

    if(this.state.showFlagsFeeForm) {
      onConfirm()
    } else {
      this.setState({ showFlagsFeeForm: true })
    }
  }

  render() {
    const { classes, isOpen, onClose } = this.props
    const { showFlagsFeeForm } = this.state

    return (
      <Dialog
        open={isOpen}
        maxWidth='md'
        className={classes.dialog}
      >
        <DialogContent className={classes.content}>
          <Box style={{ display: 'flex', flexDirection: 'column', minWidth: 96 }}>
            <img
              className={classes.image}
              src={FileIcon}
              alt='file icon'
            />
          </Box>
          <Box className={classes.texts}>
            <Typography className={classes.title} color='primary'>
              Configuração de taxas e prazos de pagamento!
            </Typography>
            <Typography>
              De acordo com a política de negociação com o seu sistema de pagamento. Acesse as taxas negociadas com o seu sistema de pagamento da <strong>Pagar.me</strong> para prosseguir com a configuração.
            </Typography>
            <Box mt={2} mb={2}>
              <Link
                href={'https://pagarme.helpjuice.com/p2-manual-da-dashboard/taxas-como-vejo-as-minhas-taxas?from_search=122935214'}
                target="_blank"
                rel="noopener noreferrer"
              >
                <strong>LINK DE ACESSO AQUI</strong>
              </Link>
            </Box>

            {showFlagsFeeForm && <StoneFlagsFeeForm />}

            <Box className={classes.buttons}>
              <Button
                className={classes.cancelButton}
                variant='outlined'
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button
                className={classes.acceptButton}
                variant='contained'
                onClick={this.handleSubmit}
                color='primary'
              >
                {!showFlagsFeeForm ? 'Ok, avançar' : 'Ok, salvar'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    )
  }
}

export default withStyles(styles)(StoneFeeConfigDialog)
