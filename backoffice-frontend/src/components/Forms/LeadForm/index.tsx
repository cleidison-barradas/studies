import React, { Component } from 'react'
import { Field } from 'formik'
import { Grid, MenuItem, withStyles } from '@material-ui/core'

import Lead from '../../../interfaces/Lead'

import PaperBlock from '../../PaperBlock'
import SelectFormField from '../../SelectFormField'
import TextFormField from '../../TextFormField'
import StatusHistoryField from '../../StatusHistoryField'

import styles from './styles'

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
  values: Lead
}

export class LeadForm extends Component<Props> {
  render() {
    const { values } = this.props
    return (
      <>
        <PaperBlock title='Informações da Loja'>
          <Grid container spacing={3}>
            <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
              <Field name='name' label='Nome do Responsável' component={TextFormField} disabled />
            </Grid>
            <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
              <Field name='ownerPhone' label='Telefone do Responsável' component={TextFormField} disabled />
            </Grid>
            <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
              <Field name='storeName' label='Nome da Loja' component={TextFormField} disabled />
            </Grid>
            <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
              <Field name='storePhone' label='Telefone da Loja' component={TextFormField} disabled />
            </Grid>
            <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
              <Field name='cnpj' label='CNPJ da Loja' component={TextFormField} disabled />
            </Grid>
            <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
              <Field name='email' label='Email' component={TextFormField} disabled />
            </Grid>
          </Grid>
        </PaperBlock>
        <PaperBlock title='Colaborador Responsável'>
          <Grid container spacing={3}>
            <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
              <Field name='colaborator' label='Nome do Colaborador' component={TextFormField} disabled />
            </Grid>
            {values.colaboratorCnpj && (
              <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
                <Field name='colaboratorCnpj' label='CNPJ do Colaborador' component={TextFormField} disabled />
              </Grid>
            )}
            {values.colaboratorCpf && (
              <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
                <Field name='colaboratorCpf' label='CPF do Colaborador' component={TextFormField} disabled />
              </Grid>
            )}
            <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
              <Field name='colaboratorEmail' label='Email do Colaborador' component={TextFormField} disabled />
            </Grid>
            <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
              <Field name='colaboratorPhone' label='Telefone Celular do Colaborador' component={TextFormField} disabled />
            </Grid>
          </Grid>
        </PaperBlock>
        <PaperBlock title='Status'>
          <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
            <Field name='status' label='Status' component={SelectFormField}>
              <MenuItem value='open'>Aberto</MenuItem>
              <MenuItem value='pending'>Em andamento</MenuItem>
              <MenuItem value='closed'>Fechado</MenuItem>
            </Field>
          </Grid>
          <Grid item lg={6} md={12} xs={12} sm={12} xl={4}>
            <StatusHistoryField value={values.statusHistory} />
          </Grid>
        </PaperBlock>
      </>
    )
  }
}

export default withStyles(styles)(LeadForm)
