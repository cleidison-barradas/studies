import React, { Component } from 'react'
import { Form, Formik } from 'formik'
import { Box, Button, CircularProgress, Grid, Typography, withStyles } from '@material-ui/core'
import * as Yup from 'yup'

import InstallmentsDetails from '../../../interfaces/installmentsDetails'
import PaymentMethods from '../../../interfaces/paymentMethods'
import PaymentOption from '../../../interfaces/paymentOption'

import { PutGatewayMethodRequest, RequestPutPix } from '../../../services/api/interfaces/ApiRequest'

import PaperBlock from '../../PaperBlock'

import SelectGateway from '../../SelectGateway'

import InstallmentsForm from '../../Forms/InstallmentsForm'
import PagseguroForm from '../../Forms/PagseguroForm'
import PicpayForm from '../../Forms/PicpayForm'
import PixForm from '../../Forms/PixForm'
import StoneForm from '../../Forms/StoneForm'
import TicketForm from '../../Forms/TicketForm'

import styles from './styles'

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
  getGatewaysMethod: (id?: string) => Promise<void>
  putGatewayMethod: (data: PutGatewayMethodRequest) => Promise<void>
  requestPutPix: (payload: FormData) => Promise<void>
  deleteGatewayMethod: (id: string) => Promise<void>
  requestGetPaymentOption: () => Promise<void>
  paymentOptions: PaymentOption[]
  payments: PaymentMethods[]
}

interface State {
  gatewaySelected: string
}

class GatewaysPaper extends Component<Props, State> {
  state = {
    gatewaySelected: 'none',
  }

  async componentDidMount() {
    const { getGatewaysMethod, requestGetPaymentOption, payments } = this.props
    await getGatewaysMethod()
    await requestGetPaymentOption()

    const activeGateway = payments.find((payment) => payment.active === true)
    if (activeGateway) {
      const {
        paymentOption: { name },
      } = activeGateway
      if (name === 'Stone') this.setState({ gatewaySelected: 'stone' })
      if (name === 'Pagseguro') this.setState({ gatewaySelected: 'pagseguro' })
    }
  }

  async componentDidUpdate(prevProps: Props) {
    const { payments } = this.props

    if (prevProps.payments.length !== this.props.payments.length) {
      const activeGateway = payments.find((payment) => payment.active === true)
      if (activeGateway) {
        const {
          paymentOption: { name },
        } = activeGateway
        if (name === 'Stone') this.setState({ gatewaySelected: 'stone' })
        if (name === 'Pagseguro') this.setState({ gatewaySelected: 'pagseguro' })
      }
    }
  }

  getInitialValues = (option: string) => {
    const paymentMethod = this.getGateway(option)
    const paymentOptionName = paymentMethod.paymentOption.name

    const installmentsDetails: InstallmentsDetails = {
      minValueToInstallmentsFlag: false,
      maxInstallments: 12,
      minValueToInstallments: 0,
      applyInstallmentsFee: false,
      applyInstallmentsFeeFrom: 1,
      manualFee: paymentOptionName === 'Stone' ? true : false,
      cardsFlagFee: paymentOptionName === 'Stone' ? {
        visaFee: {
          twoToSixFee: 0.00,
          sevenToTwelveFee: 0.00
        },
        masterCardFee: {
          twoToSixFee: 0.00,
          sevenToTwelveFee: 0.00
        },
        americanExpressFee: {
          twoToSixFee: 0.00,
          sevenToTwelveFee: 0.00
        },
        hipercardFee: {
          twoToSixFee: 0.00,
          sevenToTwelveFee: 0.00
        },
        eloFee: {
          twoToSixFee: 0.00,
          sevenToTwelveFee: 0.00
        },
        cabalFee: {
          twoToSixFee: 0.00,
          sevenToTwelveFee: 0.00
        }
      } : {}
    }

    const extras: string[] = []

    const initialValues = {
      _id: paymentMethod._id ?? '',
      installmentsDetails,
      paymentOption: this.getGatewayOption(option)!,
      active: true,
      extras
    }

    if (paymentMethod.extras.length > 0) {
      initialValues.extras = paymentMethod.extras
    }

    if (paymentMethod.installmentsDetails) {
      initialValues.installmentsDetails = paymentMethod.installmentsDetails

      if (paymentMethod.installmentsDetails.minValueToInstallments! > 0) initialValues.installmentsDetails.minValueToInstallmentsFlag = true
    }

    return initialValues
  }

  paymentValidationSchema = Yup.object({
    paymentMethod: Yup.object({
      installmentsDetails: Yup.object({
        minValueToInstallmentsFlag: Yup.boolean(),
        maxInstallments: Yup.number()
          .required('Quantidade de parcelas tem que ser definida!')
          .min(1, 'A quantidade mínima de parcelas é 1')
          .max(12, 'A quantidade máxima de parcelas é 12'),
        minValueToInstallments: Yup.number().when('minValueToInstallmentsFlag',
          (field, schema) => {
            if (field) return schema.min(1, 'O Valor deve ser maior que R$ 1,00!')

            return schema
          }),
        applyInstallmentsFee: Yup.boolean(),
        cardsFlagFee: Yup.object({
          visaFee: Yup.object({
            twoToSixFee: Yup.number(),
            sevenToTwelveFee: Yup.number(),
          }),
          masterCardFee: Yup.object({
            twoToSixFee: Yup.number(),
            sevenToTwelveFee: Yup.number(),
          }),
          americanExpressFee: Yup.object({
            twoToSixFee: Yup.number(),
            sevenToTwelveFee: Yup.number(),
          }),
          hipercardFee: Yup.object({
            twoToSixFee: Yup.number(),
            sevenToTwelveFee: Yup.number(),
          }),
          eloFee: Yup.object({
            twoToSixFee: Yup.number(),
            sevenToTwelveFee: Yup.number(),
          }),
          cabalFee: Yup.object({
            twoToSixFee: Yup.number(),
            sevenToTwelveFee: Yup.number(),
          }),
        })
      }),

    })
  })

  getGatewayOption = (option: string) => {
    const { paymentOptions } = this.props
    return paymentOptions.find(
      (value: PaymentOption) =>
        value.name.toLowerCase() === option.toLowerCase() && (value.type === 'gateway' || value.type === 'ticket')
    )
  }

  getPaymentMethod = (option: string) => {
    const { payments } = this.props
    return payments.find((value: PaymentMethods) => value.paymentOption.name.toLowerCase() === option.toLowerCase())
  }

  getGateway = (gateway: string): PaymentMethods => {
    const { payments } = this.props
    const paymentMethod = payments.find(
      (value: PaymentMethods) => value.paymentOption.name.toLowerCase().trim() === gateway.toLowerCase().trim()
    )
    if (paymentMethod) {
      return paymentMethod
    } else {
      return {
        extras: ['', '', ''],
        paymentOption: this.getGatewayOption(gateway)!,
      }
    }
  }

  handleSubmit = async (paymentMethod: PaymentMethods) => {
    const { putGatewayMethod, getGatewaysMethod } = this.props

    await putGatewayMethod({ paymentMethod })
    await getGatewaysMethod()
  }

  onDeleteMethod = async (id: string) => {
    const { deleteGatewayMethod, getGatewaysMethod } = this.props
    await deleteGatewayMethod(id)
    await getGatewaysMethod()
  }

  onSubmitPix = async (data: RequestPutPix) => {
    const { requestPutPix, getGatewaysMethod } = this.props

    const bodyForm = new FormData()
    bodyForm.append('paymentMethod', JSON.stringify(data.paymentMethod))
    bodyForm.append('file', data.certificate!)

    await requestPutPix(bodyForm)
    await getGatewaysMethod()
  }

  handleChangeGateway = (gateway: string) => {
    if (gateway === 'stone') {
      this.setState({ gatewaySelected: 'stone' })
    } else if (gateway === 'pagseguro') {
      this.setState({ gatewaySelected: 'pagseguro' })
    } else {
      this.setState({ gatewaySelected: 'none' })
    }
  }

  render() {
    const { classes } = this.props
    const { gatewaySelected } = this.state
    return (
      <div>
        <PaperBlock title={'Gateways de pagamento'}>
          <Box mb={2}>
            <Typography className={classes.caption}>
              Preencha os campos dos gateways com os dados corretos para liberar o metodo de pagamento em sua loja
            </Typography>
          </Box>
          <Box mb={3}>
            <Formik initialValues={this.getGateway('picpay')} enableReinitialize onSubmit={this.handleSubmit}>
              {({ values, isSubmitting, dirty }) => (
                <Form>
                  <PicpayForm />
                  <Box mt={2}>
                    <Grid container spacing={2}>
                      {values._id && (
                        <Grid item>
                          <Button
                            variant="contained"
                            onClick={async () => {
                              await this.onDeleteMethod(values._id!)
                            }}
                            classes={{ contained: classes.redbtn }}
                          >
                            Remover
                          </Button>
                        </Grid>
                      )}
                      <Grid item>
                        <Button
                          type="submit"
                          disabled={values.extras[0] === '' || values.extras[1] === '' || !dirty}
                          variant="contained"
                          color="primary"
                        >
                          {isSubmitting ? <CircularProgress size={20} /> : 'Salvar'}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
          <Box mb={6}>
            <Typography className={classes.title}>Cartão de crédito online</Typography>
            <Typography className={classes.caption}>
              Selecione um método de pagamento para cartão de crédito online abaixo.
            </Typography>
            <SelectGateway
              value={this.state.gatewaySelected}
              onChangeGateway={this.handleChangeGateway}
            />
            {gatewaySelected === 'stone' ? (
              <Box mb={3}>
                <Formik
                  initialValues={{ paymentMethod: this.getInitialValues('stone') }}
                  enableReinitialize
                  onSubmit={({ paymentMethod }) => this.handleSubmit(paymentMethod)}
                  validationSchema={this.paymentValidationSchema}
                >
                  {({ values, isSubmitting, dirty, errors }) => {
                    return (
                      <Form>
                        <StoneForm />
                        <InstallmentsForm
                          maxInstallmentsAllowed={12}
                        />
                        <Box mt={2}>
                          <Grid container spacing={2}>
                            {values.paymentMethod?._id && (
                              <Grid item>
                                <Button
                                  variant="contained"
                                  onClick={async () => {
                                    await this.onDeleteMethod(values.paymentMethod._id!)
                                  }}
                                  classes={{ contained: classes.redbtn }}
                                >
                                  Remover
                                </Button>
                              </Grid>
                            )}
                            <Grid item>
                              <Button
                                type='submit'
                                disabled={
                                  (values.paymentMethod?.extras[0] === '' || values.paymentMethod?.extras[1] === '')
                                }
                                variant="contained"
                                color="primary"
                              >
                                {isSubmitting ? <CircularProgress size={20} /> : 'Salvar'}
                              </Button>
                            </Grid>
                          </Grid>
                        </Box>
                      </Form>
                    )
                  }}
                </Formik>
              </Box>
            ) : null}
            {gatewaySelected === 'pagseguro' ? (
              <Box mb={3}>
                <Formik
                  initialValues={{ ...this.getGateway('pagseguro'), active: true }}
                  enableReinitialize
                  onSubmit={this.handleSubmit}
                >
                  {({ values, isSubmitting, dirty }) => {
                    return (
                      <Form>
                        <PagseguroForm />
                        <Box mt={2}>
                          <Grid container spacing={2}>
                            {values._id && (
                              <Grid item>
                                <Button
                                  variant="contained"
                                  onClick={async () => {
                                    await this.onDeleteMethod(values._id!)
                                  }}
                                  classes={{ contained: classes.redbtn }}
                                >
                                  Remover
                                </Button>
                              </Grid>
                            )}
                            <Grid item>
                              <Button
                                type="submit"
                                disabled={values.extras[0] === '' || values.extras[1] === ''}
                                variant="contained"
                                color="primary"
                              >
                                {isSubmitting ? <CircularProgress size={20} /> : 'Salvar'}
                              </Button>
                            </Grid>
                          </Grid>
                        </Box>
                      </Form>
                    )
                  }}
                </Formik>
              </Box>
            ) : null}
          </Box>
          <Box mb={3}>
            <Typography className={classes.title}>Boleto bancário</Typography>
            <Formik initialValues={{ ...this.getGateway('boleto') }} enableReinitialize onSubmit={this.handleSubmit}>
              {({ values, isSubmitting, dirty }) => (
                <Form>
                  <TicketForm />
                  <Box mt={2}>
                    <Grid container spacing={2}>
                      {values._id && (
                        <Grid item>
                          <Button
                            variant="contained"
                            onClick={async () => {
                              await this.onDeleteMethod(values._id!)
                            }}
                            classes={{ contained: classes.redbtn }}
                          >
                            Remover
                          </Button>
                        </Grid>
                      )}
                      <Grid item>
                        <Button
                          type="submit"
                          disabled={values.extras[0] === '' || values.extras[1] === ''}
                          variant="contained"
                          color="primary"
                        >
                          {isSubmitting ? <CircularProgress size={20} /> : 'Salvar'}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
          <Box mb={3}>
            <Formik initialValues={{ paymentMethod: this.getGateway('pix') }} enableReinitialize onSubmit={this.onSubmitPix}>
              {({ values, isSubmitting, dirty }) => (
                <Form>
                  <PixForm />
                  <Box mt={3}>
                    <Box mt={2}>
                      <Grid container spacing={2}>
                        {values.paymentMethod._id && (
                          <Grid item>
                            <Button
                              variant="contained"
                              onClick={async () => {
                                await this.onDeleteMethod(values.paymentMethod._id!)
                              }}
                              classes={{ contained: classes.redbtn }}
                            >
                              Remover
                            </Button>
                          </Grid>
                        )}
                        <Grid item>
                          <Button
                            type="submit"
                            disabled={
                              values.paymentMethod.extras![0] === '' ||
                              values.paymentMethod.extras![1] === '' ||
                              values.paymentMethod.extras![2] === '' ||
                              !dirty
                            }
                            variant="contained"
                            color="primary"
                          >
                            {isSubmitting ? <CircularProgress size={20} /> : 'Salvar'}
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
        </PaperBlock>
      </div>
    )
  }
}

export default withStyles(styles)(GatewaysPaper)
