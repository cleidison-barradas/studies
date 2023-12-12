import React, { Component } from 'react'
import { Field, FieldProps } from 'formik'
import { Grid, MenuItem, TextField, withStyles } from '@material-ui/core'
import InputMask from 'react-input-mask'

import CustomDatePicker from '../../CustomDatePicker'
import SelectFormField from '../../SelectFormField'
import TextFormField from '../../TextFormField'

import styles from './styles'
import SwitchFormField from '../../SwitchFormField'

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class LeadReportForm extends Component<Props> {
  render() {
    return (
      <Grid
        container
        spacing={2}
      >
        <Grid item xs={12}>
          <Field
            name='colaborator'
            label='Nome do Colaborador'
            component={TextFormField}
          />
        </Grid>
        <Grid item xs={6}>
        <Field name='colaboratorCnpj'>
            {({ field, form }: FieldProps) => (
              <InputMask
                mask='99.999.999/9999-99'
                value={field.value}
                onChange={(e) => {
                  form.setFieldValue('colaboratorCnpj', e.target.value)
                }}
              >
                {(inputProps: any) => (
                  <TextField fullWidth label='CNPJ do Colaborador' variant='outlined' {...inputProps} />
                )}
              </InputMask>
            )}
          </Field>
        </Grid>
        <Grid item xs={6}>
        <Field name='colaboratorCpf'>
            {({ field, form }: FieldProps) => (
              <InputMask
                mask='999.999.999-99'
                value={field.value}
                onChange={(e) => {
                  form.setFieldValue('colaboratorCpf', e.target.value)
                }}
              >
                {(inputProps: any) => (
                  <TextField fullWidth label='CPF do Colaborador' variant='outlined' {...inputProps} />
                )}
              </InputMask>
            )}
          </Field>
        </Grid>
        <Grid item xs={6}>
          <Field
            name='colaboratorEmail'
            label='Email do Colaborador'
            component={TextFormField}
          />
        </Grid>
        <Grid item xs={6}>
        <Field name='colaboratorPhone'>
            {({ field, form }: FieldProps) => (
              <InputMask
                mask='(99)99999-9999'
                value={field.value}
                onChange={(e) => {
                  form.setFieldValue('colaboratorPhone', e.target.value)
                }}
              >
                {(inputProps: any) => (
                  <TextField fullWidth label='Telefone do Colaborador' variant='outlined' {...inputProps} />
                )}
              </InputMask>
            )}
          </Field>
        </Grid>
        <Grid item xs={12}>
          <Field
            name='status'
            label='Status do Lead'
            component={SelectFormField}
          >
            <MenuItem key={'undefined'} value={''}>Todos os Status</MenuItem>
            <MenuItem key={'open'} value={'open'}>Aberto</MenuItem>
            <MenuItem key={'pending'} value={'pending'}>Em Andamento</MenuItem>
            <MenuItem key={'closed'} value={'closed'}>Fechado</MenuItem>
          </Field>
        </Grid>
        <Grid item xs={6}>
          <Field name='startDate'>
            {({ field, form }: FieldProps) => (
              <>
                <CustomDatePicker label='De' date={field.value} setDate={(date: Date) => form.setFieldValue('startDate', date)} />
              </>
            )}
          </Field>
        </Grid>
        <Grid item xs={6}>
          <Field name='endDate'>
            {({ field, form }: FieldProps) => (
              <>
                <CustomDatePicker label='Até' date={field.value} setDate={(date: Date) => form.setFieldValue('endDate', date)} />
              </>
            )}
          </Field>
        </Grid>
        <Grid item xs={12}>
          <Field
            name='sdrInfo'
            label='Exibir SDR responsável'
            component={SwitchFormField}
          />
        </Grid>

      </Grid >
    )
  }
}

export default withStyles(styles)(LeadReportForm)
