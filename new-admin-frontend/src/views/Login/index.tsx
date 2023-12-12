import { withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router'
import styles from '../../components/Forms/Login/styles'
import LoginPaper from '../../components/Papers/LoginPaper'
import customerxService from '../../services/customerx.service'

interface Props extends RouteComponentProps {
  classes: any
}

class Login extends Component<Props> {
  componentDidMount() {
    customerxService.trackingScreen()
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <div className={classes.container}>
          <div className={classes.userFormWrap}>
            <LoginPaper />
          </div>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(Login)
