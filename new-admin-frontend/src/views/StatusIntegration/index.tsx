import { withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import IntegrationPapers from '../../components/Papers/IntegrationPapers'
import style from './style'
import { IntegrationConsumer, IntegrationProvider } from '../../context/IntegrationContext'
import { SnackbarProvider, SnackbarConsumer } from '../../context/SnackbarContext'
import { StoreConsumer, StoreProvider } from '../../context/StoreContext'
import Plan from '../../interfaces/plan'

type Props = {
  mode: any
  plan?: Plan
  classes: any
}

class StatusIntegration extends Component<Props> {
  render() {
    const { mode, plan } = this.props
    return (
      <SnackbarProvider>
        <SnackbarConsumer>
          {({ openSnackbar }) => (
            <StoreProvider>
              <IntegrationProvider>
                <StoreConsumer>
                  {(storeContext) => (
                    <IntegrationConsumer>
                      {(context) => (
                        <IntegrationPapers
                          mode={mode}
                          plan={plan}
                          openSnackbar={openSnackbar}
                          context={context}
                          storeContext={storeContext}
                        />
                        // <IntegrationSkeletons mode={mode} />
                      )}
                    </IntegrationConsumer>
                  )}
                </StoreConsumer>
              </IntegrationProvider>
            </StoreProvider>
          )}
        </SnackbarConsumer>
      </SnackbarProvider>
    )
  }
}

export default withStyles(style)(StatusIntegration)
