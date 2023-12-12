import React from 'react'
import { withStyles } from '@material-ui/styles'
import { Button, Grid, MenuItem, Typography } from '@material-ui/core'
import { Field, Form, Formik } from 'formik'
import * as yup from 'yup'

import styles from './styles'

import TextFormField from '../../TextFormField'
import SelectFormField from '../../SelectFormField'
import CustomComponent from '../../CustomComponent'
import SuportLink from '../../SuportLink'

import Order from '../../../interfaces/order'
import {
  IOrderDispatch,
  IFiscalDocument,
  SubmitOrderDispatch,
  SubmitFiscalDocumentForm
} from '../../../interfaces/fiscalDocument'

interface Props {
  order: Order
  isPluggto?: boolean
  type: 'invoice' | 'shipping'
  onSetOrderDispatch: ({ orderDispatch }: SubmitOrderDispatch) => void
  onSetFiscalDocument: ({ fiscalDocument }: SubmitFiscalDocumentForm) => void
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class ExternalIntegrationForm extends CustomComponent<Props> {
  initialValues: IFiscalDocument = {
    fiscalDocumentKey: this.props.order.nfe_data?.nfe_key || null,
    fiscalDocumentLink: this.props.order.nfe_data?.nfe_link || null,
    fiscalDocumentSerie: this.props.order.nfe_data?.nfe_serie || null,
    fiscalDocumentReceipt: this.props.order.nfe_data?.nfe_number || null,
    fiscalDocumentType: this.props.order.nfe_data?.fiscal_document_type || 100
  }

  validateOrderDispatchSchema = yup.object({
    orderDispatch: yup.object({
      trackUrl: yup.string().nullable(true).required('Link de rastreio é obrigatório'),
      trackCode: yup.string().nullable(true).required('Código de rastreio é obrigatório'),
      shippingMethod: yup.string().nullable(true).required('Método de envio é obrigatório'),
      shippingCompany: yup.string().nullable(true).required('Transportadora é obrigatório'),
    })
  })

  validateSchema = yup.object({
    fiscalDocument: yup.object({
      fiscalDocumentType: yup.number().oneOf([100, 200, 300]).required('Tipo do cupom é obrigatório'),
      fiscalDocumentReceipt: yup.string().nullable(true).when('fiscalDocumentType', (field, schema) => {

        if (Number(field) === 100 || this.props.isPluggto) return schema.required('Número do cupom é obrigatório')

        return schema
      }).test({
        name: 'test-receipt',
        test(value, ctx) {
          const receipt = value?.replace(/[^0-9]+/g, '')

          if (!receipt) {
            return ctx.createError({ message: 'O número de recibo aceita somente números' })
          }

          if (receipt.length < 1) {
            return ctx.createError({ message: 'O número de recibo deve ter no mínimo 1 dígito' })
          }

          if (receipt.length > 9) {
            return ctx.createError({ message: 'O número de recibo deve ter no máximo 9 dígitos' })
          }

          return true
        }
      }),
      fiscalDocumentSerie: yup.string().nullable(true).when('fiscalDocumentType', (field, schema) => {

        if (Number(field) === 100 || this.props.isPluggto) return schema.required('Série do cupom é obrigatório')

        return schema
      }).test({
        name: 'test-serie',
        test(value, ctx) {
          const serie = value?.replace(/[^0-9]+/g, '')

          if (!serie) {
            return ctx.createError({ message: 'A série aceita somente somente números' })
          }

          if (serie.length < 1) {
            return ctx.createError({ message: 'A série deve ter no mínimo 1 dígito' })
          }

          if (serie.length > 3) {
            return ctx.createError({ message: 'A série deve ter no máximo 3 dígitos' })
          }

          return true
        }
      }),

      fiscalDocumentKey: yup.string().nullable(true).when('fiscalDocumentType', (field, schema) => {

        if (Number(field) === 200 || Number(field) === 300 || this.props.isPluggto) return schema.required('Chave NFe/CFe é obrigatório')

        return schema
      }),

      fiscalDocumentLink: yup.string().nullable(true).when('fiscalDocumentType', (field, schema) => {

        if (Number(field) === 200 || Number(field) === 300 || this.props.isPluggto) return schema.required('Link NFe/CFe é obrigatório')

        return schema
      })
    })
  })

  initialDispatchValues: IOrderDispatch = {
    trackUrl: this.props.order.shippingData?.trackUrl || null,
    trackCode: this.props.order.shippingData?.trackCode || null,
    shippingMethod: this.props.order.shippingData?.shippingMethod || null,
    shippingCompany: this.props.order.shippingData?.shippingCompany || null,
  }

  render() {
    const { classes, type, isPluggto, onSetFiscalDocument, onSetOrderDispatch } = this.props
    const disabled = this.initialValues.fiscalDocumentKey || false

    if (type === "invoice") {

      return (
        <Formik
          enableReinitialize
          onSubmit={onSetFiscalDocument}
          initialValues={{
            fiscalDocument: this.initialValues,
          }}
          validationSchema={this.validateSchema}
        >
          {({ dirty, isSubmitting }) => (
            <Form>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12} lg={12} md={12}>
                  <div className={classes.divider}>
                    <Typography>Faturamento</Typography>
                    <hr className={classes.line} />
                  </div>
                </Grid>
                <Grid item>
                  <Typography className={classes.caption}>
                    Ao colocar os dados de faturamento e clicar em "Salvar", seu pedido estará correto na integração com a Plugg.to e habilitará o formulário de "Despacho"
                  </Typography>
                </Grid>
                <Grid item xs={12} lg={12} md={12} sm={12}>
                  <Field
                    fullWidth
                    autoComplete="off"
                    className={classes.select}
                    component={SelectFormField}
                    label="Tipo de documento fiscal"
                    name="fiscalDocument.fiscalDocumentType"
                  >
                    <MenuItem value={100} key={0}>{isPluggto ? 'Plugg.to' : 'Cupom'} </MenuItem>
                    <MenuItem value={200} key={1}>CFe</MenuItem>
                    <MenuItem value={300} key={2}>NFe</MenuItem>
                  </Field>
                </Grid>
                <Grid item xs={12} lg={6} md={6}>
                  <Field
                    fullWidth
                    label="Chave"
                    autoComplete="off"
                    variant="outlined"
                    component={TextFormField}
                    className={classes.textfield}
                    name="fiscalDocument.fiscalDocumentKey"
                  />
                </Grid>
                <Grid item xs={12} lg={6} md={6}>
                  <Field
                    fullWidth
                    label="Link"
                    autoComplete="off"
                    variant="outlined"
                    component={TextFormField}
                    className={classes.textfield}
                    name="fiscalDocument.fiscalDocumentLink"
                  />
                </Grid>
                <Grid item xs={12} lg={6} md={6}>
                  <Field
                    label="Número"
                    autoComplete="off"
                    variant="outlined"
                    component={TextFormField}
                    className={classes.textfield}
                    name="fiscalDocument.fiscalDocumentReceipt"
                  />
                </Grid>
                <Grid item xs={12} lg={6} md={6}>
                  <Field
                    fullWidth
                    label="Série"
                    autoComplete="off"
                    variant="outlined"
                    component={TextFormField}
                    className={classes.textfield}
                    name="fiscalDocument.fiscalDocumentSerie"
                  />
                </Grid>
                <Grid item xs={12} lg={12} md={12} sm={12}>
                  <Button variant="contained" color="primary" type="submit" disabled={!dirty || isSubmitting} >
                    Salvar
                  </Button>
                </Grid>
                <SuportLink query="faturar um pedido plugg.to" />

              </Grid>
            </Form>
          )}
        </Formik>
      )
    } else if (type === "shipping") {
      return (
        <Formik
          enableReinitialize
          onSubmit={onSetOrderDispatch}
          initialValues={{
            orderDispatch: this.initialDispatchValues
          }}
          validationSchema={this.validateOrderDispatchSchema}
        >
          {({ dirty, isSubmitting }) => (
            <Form>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12} lg={12} md={12}>
                  <div className={classes.divider}>
                    <Typography>Despacho</Typography>
                    <hr className={classes.line} />
                  </div>
                </Grid>
                <Grid item>
                  <Typography className={classes.caption}>
                    Ao despachar o pedido com o código de entrega e link de entrega, sua integração com a Plugg.to estará quase pronta. Ao ser entregue, lembre-se de alterar o status para "Entrega finalizada" e assim seu pedido estára 100% correto.
                  </Typography>
                </Grid>
                <Grid item xs={12} lg={6} md={6}>
                  <Field
                    fullWidth
                    autoComplete="off"
                    variant="outlined"
                    disabled={!disabled}
                    component={TextFormField}
                    label="Companhia de Entrega"
                    className={classes.textfield}
                    name="orderDispatch.shippingCompany"
                  />
                </Grid>
                <Grid item xs={12} lg={6} md={6}>
                  <Field
                    fullWidth
                    autoComplete="off"
                    variant="outlined"
                    label="Método de entrega"
                    disabled={!disabled}
                    component={TextFormField}
                    className={classes.textfield}
                    name="orderDispatch.shippingMethod"
                  />
                </Grid>
                <Grid item xs={12} lg={6} md={6}>
                  <Field
                    fullWidth
                    autoComplete="off"
                    variant="outlined"
                    disabled={!disabled}
                    label="Código de entrega"
                    component={TextFormField}
                    className={classes.textfield}
                    name="orderDispatch.trackCode"
                  />
                </Grid>
                <Grid item xs={12} lg={6} md={6}>
                  <Field
                    fullWidth
                    autoComplete="off"
                    variant="outlined"
                    label="Link da entrega"
                    disabled={!disabled}
                    component={TextFormField}
                    name="orderDispatch.trackUrl"
                    className={classes.textfield}
                  />
                </Grid>
                <Grid item xs={12} lg={6} md={6}>
                  <Button variant="contained" color="primary" type="submit" disabled={!disabled || !dirty || isSubmitting}>
                    Salvar
                  </Button>
                </Grid>
                <SuportLink query="despachar um pedido plugg.to" />
              </Grid>
            </Form>
          )}
        </Formik>
      )
    }
  }
}

export default withStyles(styles)(ExternalIntegrationForm)
