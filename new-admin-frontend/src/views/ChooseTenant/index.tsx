import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import styles from '../../components/Forms/Tenant/styles'
import TenantForm from '../../components/Forms/Tenant'
import { AuthConsumer } from '../../context/AuthContext'
import customerxService from '../../services/customerx.service'

type Props = {
  classes: any
  requestSession: (data: Credential) => Promise<void>
  history: any
}

class ChooseTenant extends Component<Props> {
  handleSubmit = async (data: Credential) => {
    const { requestSession } = this.props
    await requestSession(data)
  }

  componentDidMount() {
    customerxService.trackingScreen()
  }

  render() {
    const { classes } = this.props
    return (
      <AuthConsumer>
        {(props: any) => (
          <div className={classes.root}>
            <div className={classes.container}>
              <div className={classes.userFormWrap}>
                <TenantForm handleSubmit={this.handleSubmit} {...props} {...this.props} />
              </div>
            </div>
          </div>
        )}
      </AuthConsumer>
    )
  }
}

export default withStyles(styles)(ChooseTenant)
