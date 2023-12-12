import { Grid } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import { FormikErrors } from 'formik'
import React, { Component } from 'react'
import styles from './styles'

interface Props {
  name: string
  errors: FormikErrors<any | {}>
  classes: Record<keyof ReturnType<typeof styles>, string>
}
class ContainerErrors extends Component<Props> {
  static defaultProps = {
    name: '',
    errors: {},
  }

  render() {
    const { classes, errors, name } = this.props

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12}>
          <span className={classes.spanerror}>{errors[name]}</span>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles)(ContainerErrors)
