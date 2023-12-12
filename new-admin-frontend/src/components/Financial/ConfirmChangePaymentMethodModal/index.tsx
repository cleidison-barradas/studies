import { Box, Button, Dialog, DialogContent, Typography, withStyles } from '@material-ui/core'
import { Component } from 'react'

import { PaymentMethodFaturAgil } from '..'
import ExclamationPoint from '../../../assets/images/ilustration/exclamationPoint.svg'
import FinancialContext from '../../../context/FinancialContext'
import styles from './styles'

interface Props {
  isOpen: boolean
  onClose: () => void
  onCancel: () => void
  paymentMethodSelected: PaymentMethodFaturAgil | null
  openSnackbar: (message: string, severity?: 'error' | 'info' | 'success' | 'warning' | undefined) => void
}

class ConfirmChangePaymentMethodModal extends Component<Props> {
  static contextType = FinancialContext
  context!: React.ContextType<typeof FinancialContext>

  render() {
    const { isOpen, onClose, paymentMethodSelected, onCancel } = this.props

    return (
      <Dialog
        open={isOpen}
        maxWidth="sm"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.60)',
        }}
        onBackdropClick={() => {
          onClose()
        }}
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
                width: '80px',
                height: '56px',
              }}
              src={ExclamationPoint}
              alt="exclamationPoint"
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
                fontSize: '32px',
                color: '#1999F9',
                fontWeight: 'bold',
              }}
            >
              Atenção!
            </Typography>
            {paymentMethodSelected === PaymentMethodFaturAgil.CARTAO_CREDITO_PJBANK && (
              <Typography>
                Você pode ter o cartão recorrente ativado na sua próxima renovação do plano anual. Acione o time de suporte para
                te orientar nesta atualização.
              </Typography>
            )}

            {paymentMethodSelected === PaymentMethodFaturAgil.BOLETO_PJBANK && (
              <Typography>
                Para mudar sua forma de pagamento que será ativado na sua próxima renovação do plano anual. Acione o time de
                suporte para te orientar nesta atualização.
              </Typography>
            )}

            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                flexDirection: 'row',
                gap: '16px',
                width: '100%',
              }}
            >
              <Button
                style={{
                  padding: '8px 16px',
                  width: '50%',
                }}
                variant="outlined"
                onClick={() => {
                  onCancel()
                  onClose()
                }}
              >
                Cancelar
              </Button>
              <Button
                style={{
                  backgroundColor: '#00BF91',
                  padding: '8px 16px',
                  width: '50%',
                }}
                variant="contained"
                onClick={() => {
                  onCancel()
                  onClose()
                }}
              >
                <a
                  href="https://api.whatsapp.com/send?phone=5541984620535&text=Ol%C3%A1,%20desejo%20informações%20para%20alterar%20o%20método%20de%20pagamento!"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: '#fff',
                    textDecoration: 'none',
                  }}
                >
                  {' '}
                  Ok, chamar suporte
                </a>
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    )
  }
}

export default withStyles(styles)(ConfirmChangePaymentMethodModal)
