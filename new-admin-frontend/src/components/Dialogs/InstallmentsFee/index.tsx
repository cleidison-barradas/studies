import React, { Component } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Typography,
  withStyles,
} from '@material-ui/core'

import ExclamationPoint from '../../../assets/images/exclamationPoint.svg'
import styles from './styles'

interface Props {
  isManualFee: boolean
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

class InstallmentsFeeDialog extends Component<Props> {
  render() {
    const { isOpen, onClose, onConfirm } = this.props

    return (
      <Dialog
        open={isOpen}
        maxWidth='sm'
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.60)',
        }}
        onBackdropClick={onClose}
      >
        <DialogContent
          style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'start',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          <Box style={{ display: 'flex', flexDirection: 'column' }}>
            <img
              style={{
                width: '96px',
                height: '96px',
              }}
              src={ExclamationPoint}
              alt='exclamationPoint'
            />
          </Box>
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <Typography
              style={{
                fontSize: '24px',
                color: '#FF5353',
              }}
            >
              Atenção!
            </Typography>
            <Typography>
              De acordo com a Lei Federal nº 13.455/2017, é permitido ao lojista que cobre um valor diferente pelo mesmo produto dependendo da forma de pagamento.
            </Typography>
            <Typography>
              Contudo, essa opção sendo ativa, ficará evidente para o cliente final que o mesmo pagará essa taxa por conta dessa opção de pagamento escolhida.
            </Typography>
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                flexDirection: 'row',
                gap: '16px',
                width: '100%',
                marginTop: '1rem',
              }}
            >
              <Button
                style={{
                  padding: '8px 16px',
                  width: '50%',
                }}
                variant='outlined'
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button
                style={{
                  backgroundColor: '#FF5353',
                  padding: '8px 16px',
                  width: '50%',
                }}
                variant='contained'
                onClick={onConfirm}
              >
                Ok, Cobrar do Cliente
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    )
  }
}

export default withStyles(styles)(InstallmentsFeeDialog)
