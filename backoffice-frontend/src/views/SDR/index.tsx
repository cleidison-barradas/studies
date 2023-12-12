import { withStyles } from '@material-ui/core'
import { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'

import { SDRConsumer, SDRProvider } from '../../context/SDRContext'

import SDRPaper from '../../components/Papers/SDRPaper'

import styles from './styles'

interface Params {
  id: string
}

interface Props extends RouteComponentProps<Params> {
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class SDR extends Component<Props> {
  render() {
    const { match: { params: { id } }, history } = this.props
    return (
      <SDRProvider>
        <SDRConsumer>
          {({ sdr, fetching, getSDR, postSDR, updateSDR }) => (
            <SDRPaper
              updateSDR={updateSDR}
              postSDR={postSDR}
              getSDR={getSDR}
              _id={id}
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

export default withStyles(styles)(SDR)
