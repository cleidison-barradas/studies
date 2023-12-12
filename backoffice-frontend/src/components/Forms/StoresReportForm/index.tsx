import { Box, Grid, withStyles } from '@material-ui/core'
import { Field, FieldProps } from 'formik'
import React, { Component } from 'react'
import CustomDatePicker from '../../CustomDatePicker'
import TextFormField from '../../TextFormField'
import styles from './styles'

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class StoresReportForm extends Component<Props> {
  render() {
    return (
      <Box mt={2}>
        <Box mt={2}>
          <Grid container spacing={2}>
            <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>
              <Field name="startDate">
                {({ field, form }: FieldProps) => (
                  <React.Fragment>
                    <CustomDatePicker label="De" date={field.value} setDate={(date: Date) => form.setFieldValue('startDate', date)} />
                  </React.Fragment>
                )}
              </Field>
            </Grid>
            <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>
              <Field name="endDate">
                {({ field, form }: FieldProps) => (
                  <React.Fragment>
                    <CustomDatePicker label="Até" date={field.value} setDate={(date: Date) => form.setFieldValue('endDate', date)} />
                  </React.Fragment>
                )}
              </Field>
            </Grid>
          </Grid>
        </Box>
        <Box mt={2}>
          <Grid container spacing={2}>
            <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>
              <Field
                name="orderLimit"
                label="Quantidade máxima de pedidos"
                component={TextFormField}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    )
  }
}

export default withStyles(styles)(StoresReportForm)
