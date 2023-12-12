import { CircularProgress, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import styles from './style'

type Props = {
  classes: any,
  size?: any,
  alignItems?: string,
  justifyContent?: string
}

class LoadingContainer extends Component<Props>{


  render() {
    const { classes, size = 100, alignItems = 'center', justifyContent } = this.props
    return (
      <div className={classes.loadingcontainer} style={{ alignItems, justifyContent }} >
        <CircularProgress size={size} />
      </div>
    )
  }
}

export default withStyles(styles)(LoadingContainer)