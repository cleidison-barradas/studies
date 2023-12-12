import { Box, Grid, Typography, withStyles } from '@material-ui/core'
import { Field } from 'formik'
import React, { Component } from 'react'
import PaperBlock from '../PaperBlock'
import SwitchFormField from '../SwitchFormField'

import styles from './styles'

interface Props {
  name: string
  title: string
  text: string
  image: string
  interval?: number
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class AutomationType extends Component<Props> {
  render() {
    const { classes, image, text, title, interval, name } = this.props

    return (
      <Grid item lg={6} md={6} sm={12} xs={12}>
        <PaperBlock>
          <Grid container spacing={2}>
            <Grid item lg={2} md={2} sm={2} xs={3}>
              <Grid container alignItems="center" justify="center" lg={12} xs={12} md={12} sm={12}>
                <img className={classes.icon} src={require(`../../assets/images/ilustration/${image}.svg`).default} alt="ilustration" />
              </Grid>
            </Grid>
            <Grid item lg={8} md={8} sm={8} xs={8}>
              <Grid container direction="column" justify="space-between">
                <Grid item>
                  <Box mt={1}>
                    <Typography className={classes.name}>{title}</Typography>
                  </Box>
                </Grid>

                <Grid item>
                  <Box mt={2}>
                    <Typography className={classes.description}>{text}</Typography>
                  </Box>
                </Grid>
                <Grid item>
                  <Field name="automations._id" hidden />
                  <Grid container justify="flex-end" alignItems="center">
                    <Field
                      name={interval ? `automations.${name}_${interval}` : `automations.${name}`}
                      component={SwitchFormField}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </PaperBlock>
      </Grid>
    )
  }
}

export default withStyles(styles)(AutomationType)
