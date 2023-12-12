import React, { Component } from 'react'
import { withStyles } from '@material-ui/core'

import { ThemeConsumer } from '../../context/ThemeContext'
import { StoreConsumer, StoreProvider } from '../../context/StoreContext'
import { IntegrationConsumer, IntegrationProvider } from '../../context/IntegrationContext'
import styles from './styles'
import StoreDataPaper from '../../components/Papers/StoreDataPaper'
import customerxService from '../../services/customerx.service'


type Props = {
  classes: any
}

class StoreData extends Component<Props> {
  componentDidMount() {
    customerxService.trackingScreen()
  }

  render() {
    const { classes } = this.props

    return (
      <ThemeConsumer>
        {({ mode }) => {
          return (
            <IntegrationProvider>
              <StoreProvider>
                <IntegrationConsumer>
                {({getApiIntegration, apiIntegration}) => (
                    <StoreConsumer>
                    {({ store, fetching, requestgetStore, requestaddSettings }) => {
                      return (
                        <StoreDataPaper
                          mode={mode}
                          classes={classes}
                          store={store}
                          fetching={fetching}
                          onLoad={requestgetStore}
                          onSave={requestaddSettings}
                          getApiIntegration={getApiIntegration}
                          apiIntegration={apiIntegration}
                        />
                      )
                    }}
                  </StoreConsumer>
                )}
                </IntegrationConsumer>
              </StoreProvider>
            </IntegrationProvider>
          )
        }}
      </ThemeConsumer>
    )
  }
}

export default withStyles(styles)(StoreData)
