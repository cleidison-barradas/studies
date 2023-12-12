import React, { Component } from 'react'
import {
  Grid,
  Typography,
  withStyles
} from '@material-ui/core'
import { Field, FieldProps } from 'formik'

import CurrencyTextField from '../../CurrencyTextField'

import { CREDIT_CARD_FLAGS } from './cardsData'

import styles from './styles'

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
}

export class StoneFlagsFeeForm extends Component<Props> {
  render() {
    const { classes } = this.props
    return (
      <Grid className={classes.box}>
        <Typography className={classes.title}>
          Configuração de taxas da <strong>Stone (Pagar.me)</strong>
        </Typography>
        <Grid item className={classes.content}>
          <Grid container spacing={1} style={{ padding: 16 }}
          >
            <Grid container item justify='center' alignItems='center' spacing={3}>
              <Grid item xs={2}><Typography className={classes.columnTitle}>Bandeira</Typography></Grid>
              <Grid item xs={5}><Typography className={classes.columnTitle}>Crédito de 2x até 6x</Typography></Grid>
              <Grid item xs={5}><Typography className={classes.columnTitle}>Crédito de 7x até 12x</Typography></Grid>
            </Grid>
            {CREDIT_CARD_FLAGS.map(flag => (
              <Grid key={flag.id} container item justify='center' alignItems='center' spacing={3} >
                <Grid item xs={2}>
                  <img
                    className={classes.img}
                    src={flag.imageFlag}
                    alt={flag.alt}
                  />
                </Grid>
                <Grid item xs={5}>
                  <Field name={flag.twoToSixFee}>
                    {({ field, form }: FieldProps) => (
                      <>
                        <CurrencyTextField
                          suffix='%'
                          value={field.value}
                          thousandSeparator='.'
                          className={classes.textField}
                          onChange={({ floatValue }) => {
                            form.setFieldValue(flag.twoToSixFee, floatValue)
                          }}
                        />
                      </>
                    )}
                  </Field>
                </Grid>
                <Grid item xs={5}>
                  <Field name={flag.sevenToTwelveFee}>
                    {({ field, form, meta }: FieldProps) => (
                      <>
                        <CurrencyTextField
                          suffix='%'
                          value={field.value}
                          thousandSeparator='.'
                          className={classes.textField}
                          onChange={({ floatValue }) => {
                            form.setFieldValue(flag.sevenToTwelveFee, floatValue)
                          }}
                        />
                      </>
                    )}
                  </Field>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles)(StoneFlagsFeeForm)
