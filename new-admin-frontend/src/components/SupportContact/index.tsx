import { Grid, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import TextFormMasked from '../TextFormMasked'
import styles from './styles'

type Props = {
  classes: any
  contact: number
}

class SuportContact extends Component<Props> {
  render() {
    const { classes, contact } = this.props
    return (
      <Grid container alignItems="center" justify="center" style={{ marginTop: 20 }} >
        <span className={classes.inputlabel}>Suporte telefônico: </span>
        <TextFormMasked
          label=""
          value={contact}
          mask="(99) 9.9999-9999"
          className={classes.inputcontact}
          onChange={() => Function}
        />
      </Grid>
    )
  }
}

export default withStyles(styles)(SuportContact)
