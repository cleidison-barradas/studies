import { withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import style from './style'
import { ShowcaseConsumer, ShowcaseProvider } from '../../context/ShowcaseContext'
import ShowcasePaper from '../../components/Papers/ShowcasePaper'
import customerxService from '../../services/customerx.service'

type Props = {
  classes: any
}

type State = {
  creating: boolean
}

class ShowCase extends Component<Props, State> {
  componentDidMount() {
    customerxService.trackingScreen()
  }

  render() {
    return (
      <ShowcaseProvider>
        <ShowcaseConsumer>
          {({ getShowcases, putShowcase, fetching, error }) => (
            <ShowcasePaper getShowcases={getShowcases} putShowcase={putShowcase} fetching={fetching} />
          )}
        </ShowcaseConsumer>
      </ShowcaseProvider>
    )
  }
}

export default withStyles(style)(ShowCase)
