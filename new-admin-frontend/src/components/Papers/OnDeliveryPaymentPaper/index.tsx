import { Box, Button, Chip, Grid, TextField, Typography, withStyles } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import React, { Component } from 'react'
import PaymentMethods from '../../../interfaces/paymentMethods'
import PaymentOption from '../../../interfaces/paymentOption'
import { RequestGetPayments, RequestPutPayment, RequestPutPaymentOption } from '../../../services/api/interfaces/ApiRequest'
import NewPaymentOptionDialog from '../../Dialogs/NewPaymentOptionDialog'
import PaperBlock from '../../PaperBlock'
import styles from './styles'

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
  requestGetPayments: (payload: RequestGetPayments) => Promise<void>
  requestsavePayment: (payload: RequestPutPayment) => Promise<void>
  requestAddNewPaymentOption: (data: RequestPutPaymentOption) => Promise<void>
  requestdeletePayment: (_id: string) => Promise<void>
  requestGetPaymentOption: () => Promise<void>
  paymentOptions: PaymentOption[]
  payments: PaymentMethods[]
}

interface State {
  isModalOpen: boolean
}

const translateType: any = {
  credit: 'Crédito',
  debit: 'Débito',
  gateway: 'Pagamento online',
  money: 'Dinheiro',
  covenant: 'Convênio',
}

class OnDeliveryPaymentPaper extends Component<Props, State> {
  state: State = {
    isModalOpen: false,
  }

  onChangeModal = () => {
    this.setState({
      ...this.state,
      isModalOpen: !this.state.isModalOpen,
    })
  }

  onSubmitPaymentOption = async (paymentOption: PaymentOption) => {
    const { requestAddNewPaymentOption, requestGetPaymentOption } = this.props
    await requestAddNewPaymentOption({ paymentOption })
    await requestGetPaymentOption()
    this.onChangeModal()
  }

  onDelete = async (_id: string) => {
    const { requestdeletePayment, requestGetPayments } = this.props
    await requestdeletePayment(_id)
    await requestGetPayments({})
  }

  onAddMethod = async (paymentMethod: PaymentMethods) => {
    const { requestsavePayment, requestGetPayments } = this.props
    await requestsavePayment({ paymentMethod })
    await requestGetPayments({})
  }

  render() {
    const { classes, payments, paymentOptions } = this.props
    const { isModalOpen } = this.state
    return (
        <div>
          <PaperBlock title="Pagamentos na entrega">
            <Typography className={classes.caption}> Métodos de pagamento usados na entrega do produto </Typography>
            <Box mt={3}>
              <Box mb={1}>
                <Typography color="primary">Métodos atuais </Typography>
              </Box>
              <Grid container spacing={2}>
                {payments
                  .filter((value) => value.paymentOption.type !== 'gateway')
                  .map((value) => {
                    if (value.details && value.details.payment_maxInstallments !== 1) {
                      const payment_maxInstallments = value.details.payment_maxInstallments
                      return (
                        <Grid key={value._id} item>
                          <Chip label={`${value.paymentOption.name} em até ${payment_maxInstallments}x`} onDelete={async () => await this.onDelete(value._id!)} />
                        </Grid>
                      )
                    } else if (value.paymentOption.type === 'covenant') {
                      return (
                        <Grid key={value._id} item>
                          <Chip label={`${value.paymentOption.name} à vista`} onDelete={async () => await this.onDelete(value._id!)} />
                        </Grid>
                      )
                    } else {
                      return (
                        <Grid key={value._id} item>
                          <Chip label={`${value.paymentOption.name}`} onDelete={async () => await this.onDelete(value._id!)} />
                        </Grid>
                      )
                    }
                  })}
              </Grid>
            </Box>
            <Box mt={3}>
              <Box mb={1}>
                <Typography color="primary">Métodos Disponiveis </Typography>
              </Box>
              <Grid container alignItems="center" spacing={2}>
                <Grid item lg={4} md={4} xl={3} sm={12} xs={12}>
                  <Autocomplete
                    options={paymentOptions.filter(
                      (option) => !payments.find((value) => value.paymentOption._id === option._id) && option.type !== 'gateway'
                    )}
                    getOptionLabel={(op) => `${op.name} - ${translateType[op.type]}`}
                    onChange={async (e, paymentOption) =>
                      paymentOption &&
                      (await this.onAddMethod({
                        details: {},
                        extras: [],
                        paymentOption,
                      }))
                    }
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
                <Grid item lg={5} md={6} xl={3} sm={12} xs={12}>
                  <Button onClick={this.onChangeModal} fullWidth variant="contained" classes={{ contained: classes.greenbtn }}>
                    Novo método de pagamento
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </PaperBlock>
          <NewPaymentOptionDialog open={isModalOpen} onClose={this.onChangeModal} onSubmit={this.onSubmitPaymentOption} />
        </div>
      )
  }
}

export default withStyles(styles)(OnDeliveryPaymentPaper)
