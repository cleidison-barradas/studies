import React from 'react'
import { withStyles } from '@material-ui/styles'
import styles from './styles'
import PaperBlock from '../../PaperBlock'
import { Button, Grid, Typography } from '@material-ui/core'
import { Field, Form, Formik } from 'formik'
import SwitchFormField from '../../SwitchFormField'
import ShippingBox from '../../../interfaces/shippingBox'
import StoreSettings from '../../../interfaces/storeSettings'
import Store from '../../../interfaces/store'
import SuportLink from '../../SuportLink'

import * as yup from 'yup'
import CustomComponent from '../../CustomComponent'
import AreaNotAllowed from '../../AreaNotAllowed'
import Plan from '../../../interfaces/plan'

interface Props {
  plan?: Plan
  store: Store | null
  success: boolean
  disabled: boolean
  fetching: boolean
  onSave: (data: any) => Promise<void>
  loadStoreSettings: () => Promise<void>
  snackbar: (message: string) => void
  classes: Record<keyof ReturnType<typeof styles>, string>
}

interface State {
  shippingBox: ShippingBox[]
  settings: StoreSettings | null
}

class ShippingConfigPaper extends CustomComponent<Props, State> {
  static defaultProps = {
    success: false,
    fetching: false,
    settings: null,
    store: null,
    disabled: false,
  }

  state: State = {
    settings: null,
    shippingBox: [
      {
        name: 'Formato caixa/pacote',
        code: 1,
      },
      {
        name: 'Formato rolo/prisma',
        code: 2,
      },
      {
        name: 'Envelope',
        code: 3,
      },
    ],
  }

  onLoad = async () => {
    const { loadStoreSettings } = this.props

    await loadStoreSettings()
  }

  async componentDidMount() {
    await this.onLoad()
  }

  componentDidUpdate(prevProps: any) {
    if (this.props.store?.settings !== prevProps.store?.settings) {
      this.setState((state: any) => ({
        ...state,
        settings: this.props.store?.settings,
      }))
    }
  }
  handleSubmit = async (data: any) => {
    const { success, onSave, snackbar } = this.props
    await onSave(data)

    if (success) {
      snackbar('Registros salvos com sucesso')
    } else {
      snackbar('Ocorreu um erro tente novamente')
    }
  }

  validateSchema = yup.object().shape({
    settings: yup.object().shape({
      config_shipping_courier: yup.boolean(),
      product_default_send_box: yup.number().default(0).required('Caixa de envio é obrigatório'),
      config_default_product_weight: yup.number().min(0.1, 'Não é permitido zero'),
      config_default_product_length: yup.number().min(0.1, 'Não é permitido zero'),
      config_default_product_width: yup.number().min(0.1, 'Não é permitido zero'),
      config_default_product_height: yup.number().min(0.1, 'Não é permitido zero'),
    }),
  })

  render() {
    const { plan, disabled } = this.props
    const { settings } = this.state

    return (
      <div>
        <PaperBlock title={'Configuracões e envio de encomendas (Correios)'}>
          {disabled ? (
            <Typography>Opção de envio já definida</Typography>
          ) : this.canSeeComponent(['enterprise', 'pro', 'pro-generic'], plan) ? (
            <Formik
              onSubmit={this.handleSubmit}
              validationSchema={this.validateSchema}
              initialValues={{
                settings: {
                  config_shipping_courier: settings ? settings.config_shipping_courier : false,
                  config_default_product_height: 12,
                  config_default_product_length: 17,
                  config_default_product_weight: 0.152,
                  config_default_product_width: 10,
                  ...settings,
                },
              }}
              enableReinitialize
            >
              {({ values, initialValues }) => {
                return (
                  <Form>
                    <Grid container direction='column' spacing={3}>
                      <Grid item xs={12} sm={12} lg={12} md={12}>
                        <Field
                          name="settings.config_shipping_courier"
                          label="Ativar entrega via correios ?"
                          component={SwitchFormField}
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} lg={6} md={12}>
                        <Typography style={{ color: '#A5A9AD' }} >O serviço prestado pelo Webservice dos Correios foi cancelado pela própria empresa. <br />Estamos empenhados em encontrar uma alternativa mais adequada para atender às suas necessidades.</Typography>
                      </Grid>
                      {/* <Grid item xs={12} sm={12} lg={6} md={12}>
                        <Field name="settings.product_default_send_box">
                          {({ field, form }: FieldProps) => (
                            <Autocomplete
                              options={shippingBox}
                              value={field.value}
                              renderInput={(params: AutocompleteRenderInputParams) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  label="Selecione a caixa padrão para envio"
                                  InputProps={{
                                    ...params.InputProps,
                                  }}
                                />
                              )}
                              getOptionLabel={(box: ShippingBox) => `${box.name} - ${box.code}`}
                              onChange={(event: React.ChangeEvent<{}>, option: ShippingBox | null) =>
                                form.setFieldValue('settings.product_default_send_box', option?.code)
                              }
                              className={classes.autocomplete}
                            />
                          )}
                        </Field>
                        <Grid container>
                          <Field name="settings.product_default_send_box">
                            {({ field }: FieldProps) => (
                              <Box ml={0} mt={1} key={field.value}>
                                <Chip label={shippingBox.find((x) => x.code === Number(field.value))?.name} />
                              </Box>
                            )}
                          </Field>
                        </Grid>
                      </Grid> */}
                      {/* <Grid item xs={12} sm={12} lg={12} md={12}>
                        <div className={classes.divider}>
                          <Typography>Pesos e dimensões padrão dos produtos</Typography>
                          <hr className={classes.line} />
                        </div>
                      </Grid> */}
                      {/* <Grid item>
                        <Typography className={classes.caption}>
                          Estas serão as medidas padrão usadas para calcular custos de envio caso o produto não contenha as
                          medidas definidas
                        </Typography>
                      </Grid> */}
                      {/* <Grid item xs={12} lg={6} md={6}>
                        <Field name="settings.config_default_product_weight">
                          {({ field, form }: FieldProps) => (
                            <React.Fragment>
                              <CurrencyTextField
                                suffix=" kg"
                                className={classes.currencyinput}
                                label="Peso"
                                precision="3"
                                thousandSeparator="."
                                decimalSeparator="."
                                onChange={({ floatValue }) =>
                                  form.setFieldValue('settings.config_default_product_weight', floatValue)
                                }
                                value={field.value}
                              />
                              <ContainerErrors errors={form.errors} name="settings.config_default_product_weight" />
                            </React.Fragment>
                          )}
                        </Field>
                      </Grid> */}
                      {/* <Grid item xs={12} lg={6} md={6}>
                        <Field name="settings.config_default_product_length">
                          {({ field, form }: FieldProps) => (
                            <CurrencyTextField
                              suffix=" cm"
                              className={classes.currencyinput}
                              label="Comprimento"
                              thousandSeparator="."
                              decimalSeparator="."
                              onChange={({ floatValue }) =>
                                form.setFieldValue('settings.config_default_product_length', floatValue)
                              }
                              value={field.value}
                            />
                          )}
                        </Field>
                      </Grid> */}
                      {/* <Grid item xs={12} lg={6} md={6}>
                        <Field name="settings.config_default_product_width">
                          {({ field, form }: FieldProps) => (
                            <CurrencyTextField
                              suffix=" cm"
                              className={classes.currencyinput}
                              label="Largura"
                              thousandSeparator="."
                              decimalSeparator="."
                              onChange={({ floatValue }) =>
                                form.setFieldValue('settings.config_default_product_width', floatValue)
                              }
                              value={field.value}
                            />
                          )}
                        </Field>
                      </Grid> */}
                      {/* <Grid item xs={12} lg={6} md={6}>
                        <Field name="settings.config_default_product_height">
                          {({ field, form }: FieldProps) => (
                            <CurrencyTextField
                              suffix=" cm"
                              className={classes.currencyinput}
                              label="Altura"
                              thousandSeparator="."
                              decimalSeparator="."
                              onChange={({ floatValue }) =>
                                form.setFieldValue('settings.config_default_product_height', floatValue)
                              }
                              value={field.value}
                            />
                          )}
                        </Field>
                      </Grid> */}

                      {/* <Grid item xs={12} lg={6} md={6}>
                        <Field name="settings.config_correios_free_from">
                          {({ field, form }: FieldProps) => (
                            <CurrencyTextField
                              prefix="R$ "
                              className={classes.currencyinput}
                              label="Grátis a partir"
                              thousandSeparator="."
                              decimalSeparator=","
                              onChange={({ floatValue }) => form.setFieldValue('settings.config_correios_free_from', floatValue)}
                              value={field.value}
                            />
                          )}
                        </Field>
                      </Grid> */}
                      {/* <Grid item xs={12} lg={6} md={6} /> */}
                      <Grid item xs={12} lg={6} md={6}>
                        <Button variant="contained" color="primary" type="submit" disabled>
                          Salvar
                        </Button>
                      </Grid>
                    </Grid>
                  </Form>
                )
              }}
            </Formik>
          ) : (
            <div style={{ margin: '15px 0' }}>
              <AreaNotAllowed plan={plan} />
            </div>
          )}

          <SuportLink query="integração com correios" />
        </PaperBlock>
      </div>
    )
  }
}

export default withStyles(styles)(ShippingConfigPaper)
