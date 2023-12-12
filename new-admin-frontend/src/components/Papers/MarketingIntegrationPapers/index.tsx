import { Box, Button, CircularProgress, Grid, LinearProgress, Typography, withStyles } from '@material-ui/core'
import style from './style'
import Store from '../../../interfaces/store'
import StoreSettings from '../../../interfaces/storeSettings'
import { isEqual } from 'lodash'
import { Form, Formik } from 'formik'
import MarketingIntegrationForm from '../../Forms/MarketingIntegrationForm'
import Plan from '../../../interfaces/plan'
import MarketingExternalIntegrationForm from '../../Forms/MarketingExternalIntegrationForm/MarketingExternalIntegrationForm'
import CustomComponent from '../../CustomComponent'

type Props = {
  getExternalIntegrationData: (integration: string) => any
  putExternalIntegrationData: (integration: string, data: {}) => any

  externalIntegrationData: any
  mode: any
  plan?: Plan
  classes: any
  loadStore: (...args: any) => Promise<void>
  postSettings: (...args: any) => Promise<void>
  settings: Store['settings'] | undefined
  fetching: any
  openSnackbar: (message: string, severity?: 'error' | 'info' | 'success' | 'warning') => void
  success?: boolean
}

type State = {
  settings: StoreSettings
}

class MarketingIntegrationPapers extends CustomComponent<Props, State> {
  onSave = async (settings: StoreSettings) => {
    const { postSettings } = this.props

    await postSettings({ settings })
    const { openSnackbar, success } = this.props
    if (openSnackbar && success) {
      openSnackbar('Alterações realizadas com sucesso')
    }
    await this.load()
  }

  load = async () => {
    const { loadStore } = this.props
    await loadStore()
  }

  async componentDidMount() {
    await this.load()
  }

  render() {
    const {
      getExternalIntegrationData,
      putExternalIntegrationData,
      externalIntegrationData,
      mode,
      plan,
      classes,
      fetching,
      settings = {
        config_meta_description: '',
        config_meta_title: '',
        ga_client_email: '',
        ga_private_key: '',
        gaview: '',
        config_hotjar_id: '',
        config_pixel_id: '',
        config_analytics_id: '',
        config_google_tag_manager_id: '',
        config_tawk_embed: '',
        config_ifood_client_id: '',
        config_ifood_client_secret: '',
        config_ifood_store_id: '',
      },
    } = this.props

    return (
      <div>
        <Grid item>
          <Typography className={classes.headertxt}>Integrações externas </Typography>
          <br />
        </Grid>
        {this.canSeeComponent(['pro', 'pro-generic', 'start', 'enterprise'], plan) && (
          <MarketingExternalIntegrationForm
            getExternalIntegrationData={getExternalIntegrationData}
            externalIntegrationData={externalIntegrationData}
            putExternalIntegrationData={putExternalIntegrationData}
          />
        )}
        <Formik
          initialValues={settings}
          onSubmit={async (values: StoreSettings) => {
            await this.onSave(values)
          }}
          enableReinitialize
        >
          {({ isSubmitting, values }) => (
            <Form>
              {fetching && (
                <Box mb={2}>
                  <LinearProgress />
                </Box>
              )}
              <MarketingIntegrationForm fetching={isSubmitting} values={values} mode={mode} plan={plan} settings={settings} />
              <Button color="primary" variant="contained" type="submit" disabled={isEqual(values, settings) || isSubmitting}>
                {isSubmitting ? <CircularProgress size="18px" /> : 'SALVAR'}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    )
  }
}

export default withStyles(style)(MarketingIntegrationPapers)
