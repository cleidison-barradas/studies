import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'

import { SDRConsumer, SDRProvider } from '../../context/SDRContext'
import SDRPaper from '../../components/Papers/SDRPaper'

import styles from './styles'
import { withStyles } from '@material-ui/core'

interface Props extends RouteComponentProps {
  classes: Record<keyof ReturnType<typeof styles>, string>
}
export class NewSDR extends Component<Props> {
  render() {
    const { history } = this.props
    return (
      <SDRProvider>
        <SDRConsumer>
          {({ sdr, fetching, getSDR, postSDR }) => (
            <SDRPaper
              postSDR={postSDR}
              getSDR={getSDR}
              history={history}
              fetching={fetching}
              sdr={sdr}
              save={() => {
                return new Promise((resolve) => {
                  resolve()
                })
              }}
            />
          )}
        </SDRConsumer>
      </SDRProvider>
    )
  }
}

export default withStyles(styles)(NewSDR)
