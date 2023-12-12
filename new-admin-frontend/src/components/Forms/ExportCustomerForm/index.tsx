import { Box, Grid, Typography, withStyles } from '@material-ui/core'
import { Field, FieldProps } from 'formik'
import React, { Component } from 'react'
import CustomDatePicker from '../../CustomDatePicker'
import styles from './styles'

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class ExportCustomerForm extends Component<Props> {
  render() {
    return (
      <React.Fragment>
        <Box mb={1}>
          <Typography align="center">Data de cadastro</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
            <Field name="startAt">
              {({ field, form }: FieldProps) => (
                <React.Fragment>
                  <CustomDatePicker label="De" date={field.value} setDate={(date: Date) => form.setFieldValue('startAt', date)} />
                </React.Fragment>
              )}
            </Field>
          </Grid>
          <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
            <Field name="endAt">
              {({ field, form }: FieldProps) => (
                <React.Fragment>
                  <CustomDatePicker label="Até" date={field.value} setDate={(date: Date) => form.setFieldValue('endAt', date)} />
                </React.Fragment>
              )}
            </Field>
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(ExportCustomerForm)
