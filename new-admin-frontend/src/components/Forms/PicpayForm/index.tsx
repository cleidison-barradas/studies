import { Box, Grid, Link, Typography, withStyles } from '@material-ui/core'
import { Field } from 'formik'
import React, { Component } from 'react'
import TextFormField from '../../TextFormField'
import styles from './styles'

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class PicpayForm extends Component<Props> {
  render() {
    const { classes } = this.props
    return (
      <React.Fragment>
        <Grid container spacing={2} alignItems="center">
          <Grid item lg={3} xl={1}>
            <Typography className={classes.title}>Picpay</Typography>
          </Grid>
        </Grid>
        <Box mt={2}>
          <Grid container spacing={3}>
            <Grid item lg={4} md={6} sm={12} xs={12} xl={4}>
              <Field
                name="extras.0"
                component={TextFormField}
                label="Picpay token"
                required
                className={classes.textfield}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item lg={4} md={6} sm={12} xs={12} xl={4}>
              <Field
                name="extras.1"
                component={TextFormField}
                label="Seller token"
                required
                className={classes.textfield}
                variant="outlined"
                fullWidth
              />
            </Grid>
          </Grid>
          <Box mt={1}>
            <Link
              href={`https://mypharmasupport.zendesk.com/hc/pt-br/search?utf8=%E2%9C%93&query=${'integrar com picpay'.replaceAll(
                ' ',
                '+'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Saber mais sobre como integrar o Pic Pay
            </Link>
          </Box>
        </Box>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(PicpayForm)
