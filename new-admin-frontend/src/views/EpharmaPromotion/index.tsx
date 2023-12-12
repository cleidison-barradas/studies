import React, { Component } from "react"
import { withStyles } from "@material-ui/core"
import style from './style'
import customerxService from "../../services/customerx.service"
import EpharmaPromotionConfigPaper from "../../components/Papers/EpharmaPromotionConfigPaper"
import { StoreConsumer, StoreProvider } from "../../context/StoreContext"

class EpharmaPromotion extends Component {

  componentDidMount() {
    customerxService.trackingScreen()
  }

  render() {

    return (
      <StoreProvider>
        <StoreConsumer>
          {({ requestAddEpharmaSettings, requestgetStore, store }) => (
            <EpharmaPromotionConfigPaper
              store={store}
              loadStore={requestgetStore}
              onSave={requestAddEpharmaSettings}
            />

          )}
        </StoreConsumer>
      </StoreProvider>
    )
  }
}

export default withStyles(style)(EpharmaPromotion)