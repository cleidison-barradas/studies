import { Grid, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import { FormikErrors } from 'formik'
import React, { Component } from 'react'
import styles from './styles'

interface Props {
  errors: FormikErrors<any>,
  name: string
}

class ContainerErrors extends Component<Props> {

  render() {
    const { errors, name } = this.props
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} lg={12} md={12} sm={12}>
          <Typography style={{ fontSize: 12 }} color='error' >{errors ? errors[name] : ''}</Typography>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles)(ContainerErrors)