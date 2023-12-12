import React, { Component } from 'react'
import customerxService from '../../services/customerx.service'
import MarketingEmailPapers from '../../components/Papers/MarketingEmailPapers'
import { MarketingAutomationConsumer, MarketingAutomationProvider } from '../../context/MarketingAutomations'
import Plan from '../../interfaces/plan'

type Props = {
  mode: any
  plan: Plan
  history: any
}

class MarketingEmail extends Component<Props> {
  componentDidMount() {
    customerxService.trackingScreen()
  }

  render() {
    const { mode, history , plan} = this.props
    return (
      <MarketingAutomationProvider>
        <MarketingAutomationConsumer>
          {({ automations, handleClipBoard, requestGetMarketingAutomations, requestPutMailCustomers }) => (
            <MarketingEmailPapers
              mode={mode}
              plan={plan}
              history={history}
              automations={automations}
              copyClipBoard={handleClipBoard}
              onSave={requestPutMailCustomers}
              loadAutomations={requestGetMarketingAutomations}
            />
          )}
        </MarketingAutomationConsumer>
      </MarketingAutomationProvider>
    )
  }
}

export default MarketingEmail
