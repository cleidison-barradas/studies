import { Button, Checkbox, TextField, Typography, withStyles, Tooltip } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import React, { Component } from 'react'
import { FormConsumer, FormProvider } from "../../../context/FormContext"
import Formized from "../../../components/Formized"

import PaymentOptionInterface from "../../../interfaces/paymentOption"
import PaymentMethodsInterface from "../../../interfaces/paymentMethods"

import CustomDialog from '../../CustomDialog'
import CustomDialogPaymentOptions from '../../CustomDialogPaymentOptions'
import { Form, Formik } from 'formik'
import * as yup from 'yup'
import { HelpOutline } from '@material-ui/icons'
import style from './style'


type Props = {
  classes: Record<keyof ReturnType<typeof style>, string>,
  disabled: boolean,
  loadPaymentOption: () => Promise<any>,
  onSave: (data: any) => void,
  setAddedPayments: (data: any) => void,
  addNewPaymentOptions: (data: any) => void
}

type State = {
  paymentMethods: PaymentOptionInterface[],
  onlinePayMethods: PaymentOptionInterface[],
  loading: boolean,
  selectedOnlinePayment: {
    payments: PaymentMethodsInterface[],
  },
  selectedDeliveryPayment: {
    paymentsDelivery: PaymentOptionInterface[],
    optionSelected: PaymentOptionInterface[],
  },
  inputs: {
    name: string,
    type: string
  },
  modal: {
    open: boolean,
    footer: any,
    title: string,
    dividers: boolean,

  }
}

class NewPaymentMethods extends Component<Props, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      paymentMethods: [],
      onlinePayMethods: [],
      selectedOnlinePayment: {
        payments: [],
      },
      selectedDeliveryPayment: {
        paymentsDelivery: [],
        optionSelected: []

      },
      loading: false,
      inputs: {
        name: '',
        type: '',
      },
      modal: {
        open: false,
        footer: '',
        title: 'Adicionar Novas opcões de Pagamento',
        dividers: false,
      }
    }
  }
  onLoad = async () => {
    const { loadPaymentOption } = this.props
    const response = await loadPaymentOption()

    if (response) {
      const { paymentOptions } = response

      if (paymentOptions && paymentOptions.length > 0) {

        this.setState(state => ({
          ...state,
          paymentMethods: paymentOptions.filter((option: any) => option.type !== 'gateway').filter((option: any) => option.type !== 'covenant'),
          onlinePayMethods: paymentOptions.filter((option: any) => option.type === 'gateway')
        }))
      }

    }
  }

  componentDidMount() {
    this.onLoad()
  }

  addToSelectedPayments = (payment: any = []) => {
    const newState = Object.assign({}, this.state)
    newState.selectedOnlinePayment.payments = payment

    this.setState(newState)
  }

  setStateAddedPayments = (data: any) => {
    const { setAddedPayments } = this.props
    setAddedPayments(data)

  }
  resetFields = () => {
    this.setState({
      selectedDeliveryPayment: {
        paymentsDelivery: [],
        optionSelected: [],
      },
      selectedOnlinePayment: {
        payments: []
      },
      inputs: {
        name: '',
        type: ''
      }
    }, () => {
      this.onLoad()
    })
  }
  onChangeCovenant = ({ target: { name, value } }: any) => {

    this.setState(state => ({
      ...state,
      inputs: {
        ...state.inputs,
        [name]: value
      }
    }), () => {
      this.setStateAddedPayments(value)
    })
  }

  onChangeFields = (index: any, value: any, field: any, indexItem: any) => {
    const { selectedOnlinePayment: { payments } } = this.state
    const newExtras = payments

    newExtras[index].extras[indexItem].value = value

    this.addToSelectedPayments(newExtras)
  }

  onChangePayment = (index: any, value: any) => {
    const { selectedOnlinePayment: { payments } } = this.state

    if (value) {
      const { _id, name } = value

      const samePayment = payments.filter(payment => payment._id === _id).length > 0

      if (!samePayment) {
        if (name.toLowerCase() === 'picpay') {

          payments[index]._id = _id
          payments[index].extras = [
            {
              name: `X-${name}-TOKEN`,
              placeholder: `X-${name}-TOKEN`,
              value: ''
            },
            {
              name: `X-${name}-SELLER-TOKEN`,
              placeholder: `X-${name}-SELLER-TOKEN`,
              value: ''
            },
          ]
        }
        if (name.toLowerCase() === 'pagseguro') {

          payments[index]._id = _id
          payments[index].extras = [
            {
              name: `${name}-EMAIL`,
              placeholder: `${name}-EMAIL`,
              value: ''
            },
            {
              name: `${name}-HASH`,
              placeholder: `${name}-HASH`,
              value: ''
            },
          ]
        }
        if (name.toLowerCase() === 'PIX') {

          payments[index]._id = _id
          payments[index].extras = [
            {
              name: `${name}-EMAIL`,
              placeholder: `${name}-EMAIL`,
              value: ''
            },
            {
              name: `${name}-HASH`,
              placeholder: `${name}-HASH`,
              value: ''
            },
          ]
        }
      } else {
        payments.splice(index, 1)
      }
      this.addToSelectedPayments(payments)
    }
  }

  addOnline = () => {

    const { selectedOnlinePayment: { payments } } = this.state
    const newPayments = [...payments, { _id: undefined, extras: [] }]
    this.addToSelectedPayments(newPayments)
    this.setStateAddedPayments(newPayments)
  }

  removePayment = (index: any, id?: string) => {
    const { selectedOnlinePayment: { payments } } = this.state
    const updatedPayments = payments

    updatedPayments.splice(index, 1)
    this.addToSelectedPayments(updatedPayments)
  }

  onChangePaymentsDelivery = (event: any, value: any) => {
    const { selectedDeliveryPayment: { paymentsDelivery } } = this.state
    let newPayments = paymentsDelivery

    if (value.length > 0) {
      newPayments = value.map((payment: any) => { return { _id: payment._id } })

      this.setState({
        selectedDeliveryPayment: {
          paymentsDelivery: newPayments,
          optionSelected: value,
        }
      }, () => {
        this.setStateAddedPayments(value)
      })
    } else {
      this.setState({
        selectedDeliveryPayment: {
          paymentsDelivery: [],
          optionSelected: [],
        }
      }, () => {
        this.setStateAddedPayments([])
      })
    }
  }
  onSubmit = () => {
    const { onSave } = this.props
    const { inputs } = this.state

    const { selectedDeliveryPayment: { paymentsDelivery }, selectedOnlinePayment: { payments } } = this.state
    const values = {
      payments: [...payments, ...paymentsDelivery],
      newOption: inputs
    }
    onSave(values)
    this.resetFields()
  }

  handleModal = () => {
    this.setState((state: any) => ({
      ...state,
      modal: {
        ...state.modal,
        open: !state.modal.open
      }
    }))
  }

  _renderPaymentsDelivery = () => {
    const { paymentMethods, selectedDeliveryPayment: { optionSelected } } = this.state
    const { classes } = this.props
    return (
      <Autocomplete
        className={classes.autocomplete}
        getOptionLabel={value => value.name}
        options={paymentMethods}
        value={optionSelected}
        disableCloseOnSelect
        multiple
        onChange={this.onChangePaymentsDelivery}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Adicionar Forma de Pagamento" />
        )}
        renderOption={(option, { selected }) => (
          <React.Fragment>
            <Checkbox
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.name}
          </React.Fragment>
        )}
      />
    )
  }

  _renderPaymentsOnline = () => {
    const { onlinePayMethods, selectedOnlinePayment: { payments } } = this.state
    const { classes } = this.props

    return (
      <React.Fragment>
        {
          payments.map((payment: any, index: any) => (
            <React.Fragment key={index}>
              <Autocomplete
                className={classes.autocomplete}
                options={onlinePayMethods}
                getOptionLabel={option => option.name}
                fullWidth
                onChange={(e, value) => this.onChangePayment(index, value)}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" label="Selecione seu Gateway de Pagamento" />
                )}
              />
              {
                payment.extras ? (
                  <React.Fragment>
                    <div className={classes.inputGroup} >
                      {
                        payment.extras.map((p: any, counter: any) => (
                          <TextField
                            classes={{ root: classes.input }}
                            key={counter}
                            label={p.placeholder}
                            variant="outlined"
                            name={p.name}
                            onChange={({ target: { name, value } }) => this.onChangeFields(index, value, name, counter)}
                            value={p.value}
                          />
                        ))
                      }
                    </div>
                    <div className={classes.buttonrow} >
                      <Button endIcon={<img src={require('../../../assets/images/greyTrash.svg').default} alt="" />} className={classes.button} onClick={() => this.removePayment(index)}>
                        Excluir Gateway de pagamento
                      </Button>
                    </div>
                  </React.Fragment>
                ) : null
              }
            </React.Fragment>
          ))
        }
        {
          payments.length === 0 || payments[payments.length - 1].extras ? (
            <div className={classes.buttonrow} >
              <Button endIcon={<img src={require('../../../assets/images/addCircle.svg').default} alt="" />} className={classes.button} onClick={this.addOnline} >
                Adicionar mais um Gateway
              </Button>
            </div>
          ) : null
        }
      </React.Fragment>
    )
  }

  handleAddOptions = (data: any) => {
    this.props.addNewPaymentOptions(data)
    this.handleModal()
    this.onLoad()
  }

  validationSchema = yup.object().shape({
    name: yup.string().required('Nome da opcão de pagamento obrigátorio ').min(3),
    type: yup.string().required('Selecione um tipo ex: Convênio')

  })

  render() {
    const { classes, disabled } = this.props
    const { inputs, modal: { footer, open, title } } = this.state

    return (
      <React.Fragment>
        <div className={classes.divider}>
          <Typography>Cadastrar pagamento na entrega</Typography>
          <hr className={classes.line} />
        </div>
        <FormProvider>
          <FormConsumer>
            {
              ({ form, onFormChange }) => {

                return (
                  <Formized name="payments" onChange={onFormChange} onFinish={this.onSubmit}>
                    <div className={classes.section}>
                      {this._renderPaymentsDelivery()}
                      <Button
                        variant="contained"
                        classes={{ contained: classes.printf }}
                        onClick={this.handleModal}
                      >
                        <div>
                          <Tooltip title="Se não encontrar nas opcões já disponiveis crie uma nova opcão de pagamento">
                            <HelpOutline style={{ marginRight: 10 }} />
                          </Tooltip>
                          Adicionar opcões de Pagamento
                        </div>
                      </Button>
                    </div>
                    <div className={classes.divider} >
                      <Typography>Cadastrar pagamento online</Typography>
                      <hr className={classes.line} />
                    </div>
                    <div className={classes.section}>
                      {this._renderPaymentsOnline()}
                    </div>
                    <button
                      type="submit"
                      className={classes.saveButton}
                      disabled={disabled}
                    >SALVAR</button>
                  </Formized>
                )
              }
            }
          </FormConsumer>
        </FormProvider>
        {
          open &&
          <Formik initialValues={inputs} validationSchema={this.validationSchema} onSubmit={(data: any) => this.handleAddOptions(data)}>
            {
              ({ handleSubmit }) => (
                <Form>
                  <CustomDialog
                    open={open}
                    footer={footer}
                    dividers={false}
                    title={title}
                    paperWidthSm={classes.paperWidthSm}
                    closeModal={this.handleModal}
                    content={() => (
                      <CustomDialogPaymentOptions closeModal={this.handleModal} handleSubmit={handleSubmit} />
                    )}
                  />
                </Form>
              )
            }
          </Formik>
        }
      </React.Fragment>
    )
  }
}
export default withStyles(style)(NewPaymentMethods)
