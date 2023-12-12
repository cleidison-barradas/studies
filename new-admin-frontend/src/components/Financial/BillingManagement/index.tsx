import { Box, Button, FormControlLabel, FormGroup, Grid, Switch, Typography, withStyles } from '@material-ui/core'
import { Component } from 'react'
import { PaymentMethodFaturAgil } from '..'
import FinancialContext from '../../../context/FinancialContext'
import PaperBlock from '../../PaperBlock'
import ConfirmChangePaymentMethodModal from '../ConfirmChangePaymentMethodModal'
import styles from './styles'

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
  openSnackbar: (message: string, severity?: 'error' | 'info' | 'success' | 'warning' | undefined) => void
}

type State = {
  isOpenDialog: boolean
  paymentMethodBill: boolean
  paymentMethodCreditCard: boolean
  paymentMethodSelected: PaymentMethodFaturAgil | null
  isChecked: boolean
}

class BillingManagement extends Component<Props> {
  static contextType = FinancialContext
  context!: React.ContextType<typeof FinancialContext>

  state: State = {
    isOpenDialog: false,
    paymentMethodBill: false,
    paymentMethodCreditCard: false,
    paymentMethodSelected: null,
    isChecked: false,
  }

  handleOpenDialog = () => {
    this.setState({
      isOpenDialog: true,
    })
  }

  handleCloseDialog = () => {
    this.setState({
      isOpenDialog: false,
    })
  }

  handleInitialState = () => {
    const { customer } = this.context

    this.setState({
      isChecked: false,
      paymentMethodBill: customer && customer[0].meioPagamento === PaymentMethodFaturAgil.BOLETO_PJBANK,
      paymentMethodCreditCard: customer && customer[0].meioPagamento === PaymentMethodFaturAgil.CARTAO_CREDITO_PJBANK,
      paymentMethodSelected: customer && customer[0].meioPagamento,
    })
  }

  componentDidMount() {
    this.handleInitialState()
  }

  componentDidUpdate() {
    const { customer } = this.context
    const { paymentMethodBill, paymentMethodCreditCard } = this.state

    if (!paymentMethodBill && !paymentMethodCreditCard) {
      this.setState({
        paymentMethodBill: customer && customer[0].meioPagamento === PaymentMethodFaturAgil.BOLETO_PJBANK,
        paymentMethodCreditCard: customer && customer[0].meioPagamento === PaymentMethodFaturAgil.CARTAO_CREDITO_PJBANK,
        paymentMethodSelected: customer && customer[0].meioPagamento,
      })
    }
  }

  render() {
    const { paymentMethodSelected, paymentMethodBill, paymentMethodCreditCard, isChecked } = this.state
    const { openSnackbar } = this.props
    const { customer } = this.context

    return (
      <PaperBlock title="Gestão de cobrança">
        <ConfirmChangePaymentMethodModal
          isOpen={this.state.isOpenDialog}
          onClose={this.handleCloseDialog}
          onCancel={this.handleInitialState}
          paymentMethodSelected={paymentMethodSelected}
          openSnackbar={openSnackbar}
        />

        <Box mb={3}>
          <Typography>
            Sua função de pagamento ativa é
            <span style={{ fontWeight: 'bold' }}> {paymentMethodCreditCard ? ' Cartão recorrente' : 'Boleto eletrônico'}.</span>{' '}
            Para alterar o seu método de pagamento, acione nossa equipe de Customer Success.
          </Typography>
        </Box>

        {customer && customer[0].dataExpiracao ? (
          <Typography>
            Data da proxima renovação: <span style={{ fontWeight: 'bold' }}>{customer && customer[0].dataExpiracao}</span>{' '}
          </Typography>
        ) : (
          <Typography>Você não possui um plano ativo na MyPharma.</Typography>
        )}

        {paymentMethodCreditCard && (
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Box
                style={{
                  marginTop: '1.5rem',
                  display: 'flex',
                  padding: '0.2rem 1rem',
                  borderRadius: '3.125rem',
                  background: 'rgba(88, 207, 178, 0.25)',
                }}
              >
                <Typography variant="body1" style={{ padding: '0.5rem 1rem' }}>
                  Função Cartão Recorrente Ativado
                </Typography>
              </Box>

              <Button
                onClick={() => {
                  this.setState({
                    paymentMethodSelected: PaymentMethodFaturAgil.BOLETO_PJBANK,
                  })
                  this.handleOpenDialog()
                }}
                style={{ marginTop: '32px', color: '#1999F9', cursor: 'pointer' }}
              >
                Mudar forma de pagamento
              </Button>
            </Grid>
          </Grid>
        )}

        {paymentMethodBill && (
          <FormGroup
            style={{
              marginTop: '1.5rem',
            }}
          >
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <Box
                  style={{
                    display: 'flex',
                    padding: '0.2rem 1rem',
                    borderRadius: '3.125rem',
                    background: this.state.isChecked ? 'rgba(88, 207, 178, 0.25)' : 'rgba(184, 197, 208, 0.25)',
                  }}
                >
                  <FormControlLabel
                    control={<Switch color={'#00BF91' as any} />}
                    checked={isChecked}
                    label="Função cartão desativado"
                    onChange={(_, checked) => {
                      if (checked) {
                        this.setState({
                          paymentMethodSelected: PaymentMethodFaturAgil.CARTAO_CREDITO_PJBANK,
                          isChecked: true,
                        })
                        this.handleOpenDialog()
                      }
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </FormGroup>
        )}
      </PaperBlock>
    )
  }
}

export default withStyles(styles)(BillingManagement)
