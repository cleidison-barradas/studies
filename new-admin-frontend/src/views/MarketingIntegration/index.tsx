import { withStyles } from '@material-ui/core'
import { Component } from 'react'
import MarketingIntegrationPapers from '../../components/Papers/MarketingIntegrationPapers'
import { SnackbarConsumer } from '../../context/SnackbarContext'
import { StoreConsumer, StoreProvider } from '../../context/StoreContext'
import Plan from '../../interfaces/plan'
import customerxService from '../../services/customerx.service'
import style from './style'

type Props = {
  mode: any
  plan?: Plan
  classes: any
}

class MarketingIntegration extends Component<Props> {
  componentDidMount() {
    customerxService.trackingScreen()
  }

  render() {
    const { mode, plan } = this.props
    return (
      <StoreProvider>
        <SnackbarConsumer>
          {({ openSnackbar }) => (
            <StoreConsumer>
              {({
                externalIntegrationData,
                putExternalIntegrationData,
                getExternalIntegrationData,
                requestgetStore,
                requestaddSettings,
                store,
                fetching,
                success,
              }) => (
                <MarketingIntegrationPapers
                  mode={mode}
                  plan={plan}
                  loadStore={requestgetStore}
                  postSettings={requestaddSettings}
                  settings={store?.settings}
                  success={success}
                  fetching={fetching}
                  openSnackbar={openSnackbar}
                  getExternalIntegrationData={getExternalIntegrationData}
                  putExternalIntegrationData={putExternalIntegrationData}
                  externalIntegrationData={externalIntegrationData}
                />
              )}
            </StoreConsumer>
          )}
        </SnackbarConsumer>
      </StoreProvider>
    )
  }
}

export default withStyles(style)(MarketingIntegration)
