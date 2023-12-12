import { Box, LinearProgress, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import styles from './styles'
import Banner from '../../interfaces/banner'
import StoreLayoutPaper from '../../components/Papers/StoreLayoutPaper'
import { LayoutConsumer, LayoutProvider } from '../../context/LayoutContext'
import customerxService from '../../services/customerx.service'

type Props = {
  classes: any
  openSnackbar: any
  history: any
  mode: any
}

type State = {
  banners: Banner[]
}

class StoreLayout extends Component<Props, State> {
  componentDidMount() {
    customerxService.trackingScreen()
  }

  render() {
    const { openSnackbar, mode, history } = this.props

    return (
      <LayoutProvider>
        <LayoutConsumer>
          {({ banners, store, getLayout, postLayout, fetching, success }) => (
            <React.Fragment>
              <Box mb={2}>{fetching && <LinearProgress />}</Box>
              <StoreLayoutPaper
                mode={mode}
                banners={banners}
                store={store}
                getLayout={getLayout}
                history={history}
                postLayout={postLayout}
                openSnackbar={openSnackbar}
                success={success}
              />
            </React.Fragment>
          )}
        </LayoutConsumer>
      </LayoutProvider>
    )
  }
}
export default withStyles(styles)(StoreLayout)
