import { Grid, Typography, withStyles } from '@material-ui/core'
import { Form, Formik } from 'formik'
import React from 'react'
import { stringify } from 'querystring'
import CustomComponent from '../../CustomComponent'
import AuthorizationForm from '../../Forms/AuthorizationForm'
import PaperBlock from '../../PaperBlock'
import StoreSettings from '../../../interfaces/storeSettings'
import Store from '../../../interfaces/store'
import { RouteComponentProps } from 'react-router'
import Plan from '../../../interfaces/plan'
import IntegrationModule from '../../../interfaces/integrationModule'
import AreaNotAllowed from '../../AreaNotAllowed'
import { MelhorEnvioModule } from '../../../config'
import styles from './styles'

import * as yup from 'yup'

interface AuthorizatrionBestShipping {
  code?: string
}

interface Props extends RouteComponentProps<AuthorizatrionBestShipping> {
  code?: string
  plan?: Plan
  disabled: boolean
  store: Store | null
  module: IntegrationModule | null
  loadModule: (code?: string) => void
  getAccessToken: (code: string) => Promise<void>
  onSave: (data: any) => Promise<void>
  loadStoreSettings: () => Promise<void>
}

interface State {
  settings: StoreSettings
}

class BestShipping extends CustomComponent<Props, State> {
  static defaultProps = {
    store: null,
    disabled: false,
    module: null,
  }
  state: State = {
    settings: {
      config_best_shipping: false,
      config_best_shipping_free_from: 0,
    },
  }

  onLoad = async () => {
    const { loadStoreSettings, loadModule } = this.props

    await loadStoreSettings()
    loadModule(MelhorEnvioModule)
  }

  async componentDidMount() {
    const {
      location,
      match: { url },
      getAccessToken,
    } = this.props
    const searchUrl = new URLSearchParams(location.search)

    if (searchUrl.has('code')) {
      const code = searchUrl.get('code')

      if (code) {
        await getAccessToken(code)
      }
      setTimeout(() => {
        window.location.replace(url)
      }, 800)
    }
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
    const { onSave, module } = this.props

    if (module) {
      const BaseUrl = `${window.location.origin}/delivery/config`
      const AuthRedirect = `${module.baseUrl}/oauth/authorize?`
      await onSave(data)
      if (data.settings.config_best_shipping) {
        const parsedFiels = stringify({
          client_id: module.extras['client_id'],
          redirect_uri: BaseUrl,
          response_type: 'code',
          scope: [
            'cart-read',
            'cart-write',
            'companies-read',
            'companies-write',
            'coupons-read',
            'coupons-write',
            'notifications-read',
            'orders-read',
            'products-read',
            'products-write',
            'purchases-read',
            'shipping-calculate',
            'shipping-cancel',
            'shipping-checkout',
            'shipping-generate',
            'shipping-tracking',
            'ecommerce-shipping',
            'cart-read',
            'cart-write',
          ].join(' '),
        })
        const url = [AuthRedirect, parsedFiels].join('')
        setTimeout(() => {
          window.location.href = url
        }, 800)
      }
    }

    await this.onLoad()
  }

  schemaValidator = yup.object().shape({
    settings: yup.object().shape({
      config_best_shipping: yup.boolean(),
    }),
  })

  _renderForm = () => {
    return (
      <Formik
        validationSchema={this.schemaValidator}
        enableReinitialize
        onSubmit={this.handleSubmit}
        initialValues={{
          settings: {
            ...this.state.settings,
          },
        }}
      >
        {() => (
          <Form>
            <AuthorizationForm />
          </Form>
        )}
      </Formik>
    )
  }

  render() {
    const { disabled, plan } = this.props

    return (
      <PaperBlock title="Configuracões e envio de encomendas (Melhor envio)">
        {disabled ? (
          <Typography>Opção de envio já definida</Typography>
        ) : this.canSeeComponent(['enterprise', 'pro', 'pro-generic'], plan) ? (
          <Grid container spacing={2}>
            <Grid item>{this._renderForm()}</Grid>
            <Grid item />
          </Grid>
        ) : (
          <div style={{ margin: '15px 0' }}>
            <AreaNotAllowed plan={plan} />
          </div>
        )}
      </PaperBlock>
    )
  }
}

export default withStyles(styles)(BestShipping)
