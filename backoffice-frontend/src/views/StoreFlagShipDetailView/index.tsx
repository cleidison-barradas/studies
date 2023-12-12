import React, { Component } from "react"
import { withStyles } from "@material-ui/core"
import { RouteComponentProps } from "react-router-dom"
import StoreFlagShipDetailPaper from "../../components/Papers/StoreFlagShipDetailPaper"
import { StoreConsumer, StoreProvider } from "../../context/StoreContext"
import styles from "./styles"

interface IRouteProps {
  storeId: string
}

interface Props extends RouteComponentProps<IRouteProps> { }

class StoreFlagShipDetailView extends Component<Props> {

  render() {
    const { match: { params: { storeId } } } = this.props

    return (
      <StoreProvider>
        <StoreConsumer>
          {({ store, stores, getStore, getStores, putMainStoreRequest }) => (
            <StoreFlagShipDetailPaper
              store={store}
              stores={stores}
              storeId={storeId}
              getStore={getStore}
              loadStores={getStores}
              onUpdate={putMainStoreRequest}
            />
          )}
        </StoreConsumer>
      </StoreProvider>
    )
  }
}

export default withStyles(styles)(StoreFlagShipDetailView)