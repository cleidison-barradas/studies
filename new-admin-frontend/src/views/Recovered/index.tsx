import React, { Component } from 'react'
import { Recovered as RecoveredForm } from '../../components/Forms'
import { withStyles } from '@material-ui/core/styles'
import styles from '../../components/Forms/Recovered/styles'
import customerxService from '../../services/customerx.service'

type RecoveredProps = {
  classes: any
}

class Recovered extends Component<RecoveredProps> {
  componentDidMount() {
    customerxService.trackingScreen()
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <div className={classes.container}>
          <div className={classes.userFormWrap}>
            <RecoveredForm />
          </div>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(Recovered)
