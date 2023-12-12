import { Box, Button, Typography, withStyles } from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import React, { Component } from 'react'
import * as yup from 'yup'
import { RequestPutPayment, RequestGetPayments } from '../../../services/api/interfaces/ApiRequest'
import PaymentMethods from '../../../interfaces/paymentMethods'
import PaperBlock from '../../PaperBlock'
import SwitchFormField from '../../SwitchFormField'
import { isEqual } from 'lodash'
import styles from './styles'
// eslint-disable-next-line
import TextFormField from '../../TextFormField'

interface Props {
  methods: PaymentMethods[]
  onSave: (data: RequestPutPayment) => Promise<void>
  loadMethods: (data: RequestGetPayments) => Promise<void>
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class CovenantPaper extends Component<Props> {
  static defaultProps = {
    methods: [],
  }

  state = {
    covenant: false,
  }

  onLoad = async () => {
    const { loadMethods } = this.props

    await loadMethods({})
  }

  async componentDidMount() {
    await this.onLoad()
  }

  componentDidUpdate(prevProps: any) {
    if (this.props.methods !== prevProps.methods) {
      this.setState((state: any) => ({
        ...state,
        covenant: this.props.methods.filter((method) => method.paymentOption.type === 'covenant').length > 0,
      }))
    }
  }

  handleSave = async (data: RequestPutPayment) => {
    const { onSave } = this.props
    await onSave(data)

    setTimeout(async () => {
      await this.onLoad()
    }, 800)
  }

  validateSchema = yup.object({
    paymentMethod: yup.object({
      details: yup.object({
        payment_maxInstallments: yup.number()
          .required('Quantidade de parcelas tem que ser definida!')
          .min(1, 'A quantidade mínima de parcelas é 1')
          .max(24, 'A quantidade máxima de parcelas é 24')
      })
    })
  })

  render() {
    const { classes, methods } = this.props
    const { covenant } = this.state

    const covenantMethod = methods.find(method => method.paymentOption.type === 'covenant')
    const payment_maxInstallments = (covenantMethod && covenantMethod.details?.payment_maxInstallments) ? covenantMethod.details.payment_maxInstallments : 1

    const initialValues = {
      covenant,
      paymentMethod: {
        paymentOption: {
          name: 'Convênio',
          type: 'covenant',
        },
        details: {
          payment_maxInstallments,
        }
      }
    }

    return (
      <div>
        <PaperBlock title="Convênio">
          <Formik
            onSubmit={this.handleSave}
            initialValues={initialValues}
            validationSchema={this.validateSchema}
            enableReinitialize
          >
            {({ values, initialValues }) => {
              return (
                <Form>
                  <React.Fragment>
                    <Typography className={classes.caption}> Ative e controle como funciona o convênio em sua loja. </Typography>
                    <Box mt={2}>
                      <Field component={SwitchFormField} label=" Ativar convênio?" labelPlacement="end" name="covenant" />
                    </Box>
                    <Box mt={2}>
                      {
                        values.covenant
                          ? (
                            <>
                              <Typography className={classes.caption}>Escolha o limite de parcelas para os seus clientes (O máximo é 'em até 24x'). </Typography>
                              <Field
                                name="paymentMethod.details.payment_maxInstallments"
                                label="Quantidade máxima de parcelas"
                                type="number"
                                component={TextFormField}
                                className={classes.textfield}
                              />
                            </>
                          )
                          : null
                        }
                      <Button type="submit" color="primary" variant="contained" disabled={isEqual(values, initialValues)}>
                        Salvar
                      </Button>
                    </Box>
                  </React.Fragment>
                </Form>
              )
            }}
          </Formik>
        </PaperBlock>
      </div>
    )
  }
}

export default withStyles(styles)(CovenantPaper)
