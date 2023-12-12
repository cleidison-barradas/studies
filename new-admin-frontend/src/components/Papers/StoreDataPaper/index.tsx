import { Box, Button, CircularProgress, LinearProgress, withStyles } from '@material-ui/core'
import { Form, Formik } from 'formik'
import _ from 'lodash'
import React, { Component } from 'react'
import Store from '../../../interfaces/store'
import StoreDataForm from '../../Forms/StoreDataForm'
import styles from './styles'
import * as yup from 'yup'

type Props = {
  classes: Record<keyof ReturnType<typeof styles>, string>
  fetching: any
  mode: any
  onSave: (store: Store) => Promise<void>
  onLoad: () => Promise<void>
  store?: Store
  getApiIntegration: () => void
  apiIntegration: any
} & Partial<DefaultProps>

type DefaultProps = {
  store: Store
}

class StoreDataPaper extends Component<Props> {
  static defaultProps: DefaultProps = {
    store: {
      name: '',
      settings: {
        config_company_name: '',
        config_name: '',
        config_cnpj: '',
        config_address: '',
        config_responsible_name: '',
        config_cep: '',
        config_store_city: '',
        config_email: '',
        config_store_number: '',
        config_phone: '',
        config_whatsapp_phone: '',
        config_pharmacist_crf: '',
        config_pharmacist_name: '',
        config_whatsapp_button: false,
        config_show_celphone: false,
        config_cpf_checkout: false,
        config_withdraw: false,
        config_hide_prices: false,
        config_social_login: false,
        config_stock_display: false,
        config_afe: '',
        config_pickup_in_store: true
      },
      tenant: '',
      PMC_id: 0,
      url: '',
    },
  }

  validationSchema = yup.object({
    name: yup.string().required(),
    settings: yup.object({
      config_company_name: yup.string(),
      config_name: yup.string().required(),
      config_cnpj: yup.string().required('CNPJ obrigatório'),
      config_address: yup.string().required(),
      config_responsible_name: yup.string().required('Farmaceutico obrigatório'),
      config_cep: yup.string().required('CEP obrigatório'),
      config_store_city: yup.string().required(),
      config_email: yup.string().required('email obrigatório'),
      config_store_number: yup.string().required(),
      config_phone: yup.string(),
      config_whatsapp_phone: yup.string(),
      config_pharmacist_crf: yup.string().required('CRF obrigatório'),
      config_pharmacist_name: yup.string(),
      config_hide_prices: yup.boolean(),
      config_social_login: yup.boolean(),
      config_stock_display: yup.boolean(),
      config_pickup_in_store: yup.boolean(),
    }),
  })

  componentDidMount() {
    const { getApiIntegration } = this.props
    getApiIntegration()
  }

  render() {
    const { fetching, classes, store, mode, onSave, apiIntegration } = this.props
    return (
      <Formik validationSchema={this.validationSchema} initialValues={store!} enableReinitialize onSubmit={onSave}>
        {({ values, isSubmitting, isValid, errors }) => (
          <Form>
            {fetching && (
              <Box mb={2}>
                <LinearProgress />
              </Box>
            )}
            <Button
              variant="contained"
              color="primary"
              disabled={_.isEqual(store, values) || !isValid}
              className={classes.saveButton}
              type="submit"
            >
              {isSubmitting ? <CircularProgress size={20} color="primary" /> : 'SALVAR'}
            </Button>
            <StoreDataForm mode={mode} errors={errors} store={store} integration={apiIntegration} />
            <Button
              variant="contained"
              color="primary"
              disabled={_.isEqual(store, values) || !isValid}
              className={classes.saveButton}
              type="submit"
            >
              {isSubmitting ? <CircularProgress size={20} color="primary" /> : 'SALVAR'}
            </Button>
          </Form>
        )}
      </Formik>
    )
  }
}

export default withStyles(styles)(StoreDataPaper)
