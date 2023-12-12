import { Box, Grid, MenuItem, withStyles } from '@material-ui/core'
import { Field, FieldProps } from 'formik'
import React, { Component } from 'react'
import IntegrationStatus from '../../../interfaces/IntegrationStatus'
import CustomDatePicker from '../../CustomDatePicker'
import SelectFormField from '../../SelectFormField'
import styles from './styles'

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class IntegrationReportForm extends Component<Props> {
  integrationStatus: IntegrationStatus[] = [
    {
      _id: Math.random(),
      statusName: 'healthy'
    },
    {
      _id: Math.random(),
      statusName: 'warning'
    },
    {
      _id: Math.random(),
      statusName: 'problem'
    },
    {
      _id: Math.random(),
      statusName: 'unknown'
    },
  ]

  private getLabel = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'Normal'
      case 'warning':
        return 'Atenção'
      case 'problem':
        return 'Crítico'
      default:
        return 'Desconhecido'
    }
  }

  render() {
    return (
      <Box mt={2}>
        <Box mt={2}>
          <Grid container spacing={2}>
            <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>
              <Field name="startDate">
                {({ field, form }: FieldProps) => (
                  <>
                    <CustomDatePicker label="De" date={field.value} setDate={(date: Date) => form.setFieldValue('startDate', date)} />
                  </>
                )}
              </Field>
            </Grid>
            <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>
              <Field name="endDate">
                {({ field, form }: FieldProps) => (
                  <>
                    <CustomDatePicker label="Até" date={field.value} setDate={(date: Date) => form.setFieldValue('endDate', date)} />
                  </>
                )}
              </Field>
            </Grid>
          </Grid>
        </Box>
        <Box mt={2}>
          <Grid container spacing={2}>
            <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>
              <Field
                name="status"
                label="Status da integração"
                component={SelectFormField}
                options={this.integrationStatus}
              >
                {this.integrationStatus.map((integration, index) => (
                  <MenuItem key={index} value={integration.statusName}>{this.getLabel(integration.statusName)}</MenuItem>
                ))}
              </Field>

            </Grid>
          </Grid>
        </Box>
      </Box>
    )
  }
}

export default withStyles(styles)(IntegrationReportForm)
