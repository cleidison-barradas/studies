import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { LinearProgress, Box, withStyles } from '@material-ui/core'

import { SDRConsumer, SDRProvider } from '../../context/SDRContext'
import SDRsPaper from '../../components/Papers/SDRsPaper'

import styles from './styles'

interface Props extends RouteComponentProps {
  classes: Record<keyof ReturnType<typeof styles>, string>
}

export class SDRs extends Component<Props> {
  render() {
    const { classes, history } = this.props
    return (
      <SDRProvider>
        <SDRConsumer>
          {({ getSDRs, sdrs, fetching, pagination }) => (
            <>
              <Box mt={2} mb={2} visibility={fetching ? 'visible' : 'hidden'}>
                <LinearProgress />
              </Box>
              <SDRsPaper
                sdrs={sdrs}
                pagination={pagination}
                getSDRs={getSDRs}
                classes={classes}
                history={history}
              />
            </>
          )}
        </SDRConsumer>
      </SDRProvider>
    )
  }
}

export default withStyles(styles)(SDRs)
