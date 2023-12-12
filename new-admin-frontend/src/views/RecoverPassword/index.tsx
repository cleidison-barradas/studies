import React, { Component } from 'react'
import { RecoverPassword } from '../../components/Forms'
import { withStyles } from '@material-ui/core/styles'
import styles from '../../components/Forms/RecoverPassword/styles'
import { authApi } from '../../services/api'
import customerxService from '../../services/customerx.service'

type RecoverProps = {
  classes: any
  history: any
}

class Recover extends Component<RecoverProps> {
  state = {
    recovered: false,
  }

  componentDidMount() {
    customerxService.trackingScreen()
  }

  handleSubmit = async (value: any) => {
    const { history } = this.props
    authApi.put('v1/forgotPassword', value).then((response: any) => {
      history.push('/recovered')
    })
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <div className={classes.container}>
          <div className={classes.userFormWrap}>
            <RecoverPassword handleSubmit={this.handleSubmit} />
          </div>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(Recover)
