import { Grid, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import styles from './style'
import LaunchIcon from '@material-ui/icons/Launch'

type Props = {
  classes: any
  query: string
}

class SuportLink extends Component<Props> {
  render() {
    const { classes, query } = this.props
    return (
      <Grid container alignItems="center" justify="center">
        <a
          href={`https://mypharmasupport.zendesk.com/hc/pt-br/search?utf8=%E2%9C%93&query=${query.replaceAll(' ', '+')}`}
          target="_blank"
          rel="noopener noreferrer"
          className={classes.problems}
        >
          Precisa de ajuda ? <LaunchIcon className={classes.suporticon} />
        </a>
      </Grid>
    )
  }
}

export default withStyles(styles)(SuportLink)
