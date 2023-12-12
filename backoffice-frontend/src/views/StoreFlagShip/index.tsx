import React, { Component } from 'react'
import { withStyles } from '@material-ui/core'
import { StoreConsumer, StoreProvider } from '../../context/StoreContext'
import StoreFlagShipPaper from '../../components/Papers/StoreFlagShipPaper'
import styles from './styles'

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
}


class StoreFlagShipView extends Component<Props> {

  render() {
    return (
      <StoreProvider>
        <StoreConsumer>
          {({ stores, pagination, getStores }) => (
            <StoreFlagShipPaper stores={stores} pagination={pagination} getStores={getStores} />
          )}
        </StoreConsumer>
      </StoreProvider>
    )
  }
}

export default withStyles(styles)(StoreFlagShipView)
