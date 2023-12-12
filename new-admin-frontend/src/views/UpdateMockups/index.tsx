import { withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router'
import styles from './styles'
import UpdateMockupsPaper from '../../components/Papers/UpdateMockupsPaper'
import { FileConsumer, FileProvider } from '../../context/FileContext'
import customerxService from '../../services/customerx.service'

interface Props extends RouteComponentProps {
  classes: Record<keyof ReturnType<typeof styles>, string>
  mode: any
  openSnackbar: (message: string, severity?: 'error' | 'info' | 'success' | 'warning') => void
  history: RouteComponentProps['history']
}

class UpdateMockups extends Component<Props> {
  componentDidMount() {
    customerxService.trackingScreen()
  }

  render() {
    const { openSnackbar, history } = this.props
    return (
      <FileProvider>
        <FileConsumer>
          {({ requestGetMocks, requestUpdateMocks, mockups, fetching, success }) => (
            <UpdateMockupsPaper
              updateMocks={requestUpdateMocks}
              getMocks={requestGetMocks}
              mocks={mockups}
              fetching={fetching}
              openSnackbar={openSnackbar}
              success={success}
              history={history}
            />
          )}
        </FileConsumer>
      </FileProvider>
    )
  }
}

export default withStyles(styles)(UpdateMockups)
