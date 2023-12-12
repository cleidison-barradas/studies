import { Component } from 'react'
import { Box, Grid, withStyles } from '@material-ui/core'
import SuportLink from '../../components/SuportLink'
import { RouteComponentProps } from 'react-router-dom'
import customerxService from '../../services/customerx.service'
import { MarketingAutomationConsumer, MarketingAutomationProvider } from '../../context/MarketingAutomations'
import MarketingAutomationsPaper from '../../components/Papers/MarketingAutomationsPaper'
import styles from './style'
import Plan from '../../interfaces/plan'

interface Props extends RouteComponentProps {
  mode: string
  plan: Plan
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class MarketingAutomations extends Component<Props> {
  componentDidMount() {
    const { plan, history } = this.props

    if (plan?.rule === 'institutional') {
      history.push('/marketing/automations/email')
    }

    customerxService.trackingScreen()
  }

  render() {
    const { mode } = this.props
    return (
      <MarketingAutomationProvider>
        <MarketingAutomationConsumer>
          {({ automations, requestGetMarketingAutomations, requestPutMarketingAutomations }) => (
            <Box>
              <MarketingAutomationsPaper
                {...this.props}
                mode={mode}
                automations={automations}
                onSave={requestPutMarketingAutomations}
                loadAutomations={requestGetMarketingAutomations}
              />
              <Box mt={16}>
                <Grid container justify="center" alignItems="center">
                  <Grid item>
                    <Grid container spacing={3}>
                      <Grid item>
                        <SuportLink query="disparos de email" />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </MarketingAutomationConsumer>
      </MarketingAutomationProvider>
    )
  }
}

export default withStyles(styles)(MarketingAutomations)
