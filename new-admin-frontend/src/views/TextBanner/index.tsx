import { Component } from 'react'
import { Box, LinearProgress, withStyles } from '@material-ui/core'

import TextBannerPaper from '../../components/Papers/TextBannerPaper'

import { TextBannerConsumer, TextBannerProvider } from '../../context/TextBannerContext'

import customerxService from '../../services/customerx.service'

import styles from '../StoreLayout/styles'

type Props = {
  history: any
  classes: any
  store: any
  openSnackbar: any
  mode: any
}

type State = {}

export class TextBanner extends Component<Props, State> {
  componentDidMount() {
    customerxService.trackingScreen()

    const { history } = this.props
    const store = history.location.state?.store

    if (!store) {
      history.push('/store/layout')
    }
  }

  render() {
    const { openSnackbar, mode, history } = this.props

    return (
      <TextBannerProvider>
        <TextBannerConsumer>
          {({ fetching, updateBanner }) => {
            return (
              <>
                <Box mb={2}>{fetching && <LinearProgress />}</Box>

                <TextBannerPaper
                  {...history.location.state}
                  history={history}
                  mode={mode}
                  updateBanner={updateBanner}
                  openSnackbar={openSnackbar}
                />
              </>
            )
          }}
        </TextBannerConsumer>
      </TextBannerProvider>
    )
  }
}
export default withStyles(styles)(TextBanner)
