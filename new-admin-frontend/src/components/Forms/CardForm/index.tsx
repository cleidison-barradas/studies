import { Box, Button, Grid, Typography, withStyles } from '@material-ui/core'
import { Field, FieldProps, Form, Formik } from 'formik'
import { Component } from 'react'
import Cards, { Focused } from 'react-credit-cards'
import 'react-credit-cards/es/styles-compiled.css'
import CreditCardSvg from '../../../assets/images/ilustration/creditCard.svg'
import FinancialContext from '../../../context/FinancialContext'
import { PaymentMethodFaturAgil } from '../../Financial'
import PaperBlock from '../../PaperBlock'
import TextFormField from '../../TextFormField'
import TextFormMasked from '../../TextFormMasked'
import styles from './styles'

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
  openSnackbar: (message: string, severity?: 'error' | 'info' | 'success' | 'warning' | undefined) => void
}

class CreditCardForm extends Component<Props> {
  static contextType = FinancialContext
  context!: React.ContextType<typeof FinancialContext>

  state = {
    focused: '',
  }

  handleInputFocus = (fieldName: string) => {
    this.setState({
      focused: fieldName,
    })
  }

  render() {
    const { classes, openSnackbar } = this.props
    const { focused } = this.state
    const { changeRecurringCard, customer, paymentMethodSelected } = this.context

    const cardData = customer && customer[0].cartaoCredito

    return (
      <PaperBlock title="Cartão recorrente">
        {(customer && customer[0].meioPagamento === PaymentMethodFaturAgil.CARTAO_CREDITO_PJBANK) ||
        paymentMethodSelected === PaymentMethodFaturAgil.CARTAO_CREDITO_PJBANK ? (
          <Formik
            initialValues={{
              number: cardData ? `${cardData.numeroCartao.substring(0, 4)}00000000${cardData.numeroCartao.slice(-4)}` : '',
              name: cardData && cardData.nomeImpressoCartao ? cardData.nomeImpressoCartao : '',
              expiry: cardData && cardData.vencimentoCartao ? cardData.vencimentoCartao : '',
              cvc: '',
              cpf: cardData && cardData.cpfPortadorCartao ? cardData.cpfPortadorCartao : '',
            }}
            onSubmit={async (values, { resetForm }) => {
              try {
                if (customer) {
                  await changeRecurringCard(values, customer[0].idCliente)
                  openSnackbar('Cartão recorrente atualizado com sucesso.', 'success')
                  resetForm()
                }
              } catch (error) {
                openSnackbar('Ocorreu um erro ao atualizar o cartão recorrente.', 'error')
              }
            }}
          >
            {({ values, isSubmitting }) => (
              <Form>
                <Box mb={4}>
                  <Typography>
                    Preencha os campos com os dados corretos para ser atualizado o cartão recorrente. Se você já tiver um cartão
                    recorrente cadastrado, exibiremos somente os últimos 4 dígitos do número do cartão, juntamente com os 4
                    primeiros dígitos que são válidos. Essa exibição limitada dos dígitos visa proteger suas informações pessoais
                    e garantir a segurança dos seus dados.
                  </Typography>
                </Box>
                <Grid container spacing={3}>
                  <Grid item alignItems="center" justify="center" xs={12} sm={12} md={4} lg={12} xl={4}>
                    <Cards
                      cvc={values.cvc}
                      expiry={values.expiry}
                      focused={focused as Focused}
                      name={values.name}
                      number={values.number}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={8} lg={12} xl={8}>
                    <div style={{ marginBottom: '1rem' }}>
                      <Field name="number">
                        {({ field, form }: FieldProps) => (
                          <TextFormMasked
                            label="Número do Cartão"
                            value={field.value}
                            mask="9999 9999 9999 9999"
                            className={classes.inputMask}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              form.setFieldValue('number', event.target.value)
                              this.handleInputFocus('')
                            }}
                          />
                        )}
                      </Field>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <Field
                        component={TextFormField}
                        label="Nome impresso no cartão"
                        name="name"
                        fullWidth
                        required
                        variant="outlined"
                        className={classes.textfield}
                      />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <Field name="expiry">
                        {({ field, form }: FieldProps) => (
                          <TextFormMasked
                            label="Data de Validade"
                            value={field.value}
                            mask="99/9999"
                            className={classes.inputMask}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              form.setFieldValue('expiry', event.target.value)
                              this.handleInputFocus('')
                            }}
                          />
                        )}
                      </Field>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <Field name="cvc">
                        {({ field, form }: FieldProps) => (
                          <TextFormMasked
                            label="CVC"
                            value={field.value}
                            mask="999"
                            className={classes.inputMask}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              form.setFieldValue('cvc', event.target.value)
                              this.handleInputFocus('cvc')
                            }}
                          />
                        )}
                      </Field>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <Field name="cpf">
                        {({ field, form }: FieldProps) => (
                          <TextFormMasked
                            label="CPF"
                            value={field.value}
                            mask="999.999.999-99"
                            className={classes.inputMask}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              form.setFieldValue('cpf', event.target.value)
                              this.handleInputFocus('')
                            }}
                          />
                        )}
                      </Field>
                    </div>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={isSubmitting}
                      className={classes.saveButton}
                    >
                      {cardData ? ' Atualizar Cartão' : 'Cadastrar Cartão Recorrente'}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        ) : (
          <Box className={classes.box}>
            <img src={CreditCardSvg} alt="Função Desativada" />

            <Box className={classes.boxContentText}>
              <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                Função Desativada
              </Typography>

              <Typography align="center">
                A função de pagamento "Cartão Recorrente" não está disponível para o seu plano atual. Para utilizar essa opção,
                por favor, selecione outro método de pagamento.
              </Typography>
            </Box>
          </Box>
        )}
      </PaperBlock>
    )
  }
}

export default withStyles(styles)(CreditCardForm)
