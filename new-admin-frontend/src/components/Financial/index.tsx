import { Box, Button, Grid, Typography, withStyles } from '@material-ui/core'
import { Component } from 'react'
import { Link } from 'react-router-dom'
import PaymentForm from '../../components/Forms/CardForm'
import { CustomerProps, InvoiceProps } from '../../context/FinancialContext'
import Store from '../../interfaces/store'
import LoadingContainer from '../LoadingContainer'
import BillingManagement from './BillingManagement'
import InvoicePending from './InvoicePending'
import IssuedNfe from './issued-nfe'
import styles from './style'

export enum PaymentMethodFaturAgil {
  BOLETO_PJBANK = 'BOLETO_PJBANK',
  BOLETO_PJBANK_C2 = 'BOLETO_PJBANK_C2',
  BOLETO_PJBANK_C3 = 'BOLETO_PJBANK_C3',
  TRANSFERENCIA_BANCARIA = 'TRANSFERENCIA_BANCARIA',
  CARTAO_CREDITO_PJBANK = 'CARTAO_CREDITO_PJBANK',
}

export enum NotificationType {
  LOCKED = 'LOCKED',
  EXPIRED = 'EXPIRED',
  EXPIRING = 'EXPIRING',
  WARNING = 'WARNING',
  ATTENTION = 'ATTENTION',
}

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
  store?: Store
  loadCustomer: (cnpj: string) => Promise<void>
  loadInvoices: (cnpj: string) => Promise<void>
  loadNfes: (cnpj: string) => Promise<void>
  customer?: CustomerProps[]
  invoices?: InvoiceProps[]
  openSnackbar: (message: string, severity?: 'error' | 'info' | 'success' | 'warning' | undefined) => void
}

class Financial extends Component<Props> {
  async componentDidUpdate(prevProps: Props) {
    const { loadCustomer, store, loadInvoices, loadNfes } = this.props

    if (store?._id !== undefined && prevProps.store?._id !== store?._id) {
      const cnpj = store?.settings?.config_cnpj?.replace(/[.\-/]/g, '').trim()

      if (cnpj) {
        loadCustomer(cnpj)
        loadInvoices(cnpj)
        loadNfes(cnpj)
      }
    }
  }

  render() {
    const { openSnackbar, customer, classes } = this.props

    return (
      <>
        <Box className={classes.boxContent}>
          <Typography className={classes.headertxt}>Financeiro</Typography>

          <Button variant="contained" color="primary" type="button" className={classes.saveButton}>
            <Link to="/" style={{ color: '#FFFFFF', textDecoration: 'none' }}>
              Painel de controle
            </Link>
          </Button>
        </Box>

        {customer ? (
          <Grid container spacing={3} className={classes.grid}>
            <>
              <Grid item sm={12} lg={12} xl={8}>
                <Box
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <PaymentForm openSnackbar={openSnackbar} />

                  <InvoicePending openSnackbar={openSnackbar} />

                  <IssuedNfe openSnackbar={openSnackbar} />
                </Box>
              </Grid>
              <Grid
                item
                sm={12}
                lg={12}
                xl={4}
                style={{
                  height: '100%',
                }}
              >
                <BillingManagement openSnackbar={openSnackbar} />
              </Grid>
            </>
          </Grid>
        ) : (
          <Box
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <LoadingContainer />
          </Box>
        )}
      </>
    )
  }
}

export default withStyles(styles)(Financial)
