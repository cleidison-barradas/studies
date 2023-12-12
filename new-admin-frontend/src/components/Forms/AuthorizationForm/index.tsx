import { Box, Button, Grid, Link, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import { Field, FieldProps } from 'formik'
import React, { Component } from 'react'
import ContainerErrors from '../../ContainerErrors'
import CurrencyTextField from '../../CurrencyTextField'
import SwitchFormField from '../../SwitchFormField'
import styles from './styles'

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class AuthorizationForm extends Component<Props> {
  render() {
    const { classes } = this.props

    return (
      <React.Fragment>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Field name="settings.config_best_shipping" label="Ativar entrega via Melhor envio ?" component={SwitchFormField} />
          </Grid>
          <Grid item xs={12} sm={12} lg={12} md={12}>
            <div className={classes.divider}>
              <Typography>Pesos e dimensões padrão dos produtos</Typography>
              <hr className={classes.line} />
            </div>
          </Grid>
          <Grid item>
            <Typography className={classes.caption}>
              Estas serão as medidas padrão usadas para calcular custos de envio caso o produto não contenha as medidas definidas
            </Typography>
          </Grid>
          <Grid item xs={12} lg={6} md={6}>
            <Field name="settings.config_default_product_weight">
              {({ field, form }: FieldProps) => (
                <React.Fragment>
                  <CurrencyTextField
                    suffix=" kg"
                    className={classes.currencyinput}
                    label="Peso"
                    precision="3"
                    thousandSeparator="."
                    decimalSeparator="."
                    onChange={({ floatValue }) => form.setFieldValue('settings.config_default_product_weight', floatValue)}
                    value={field.value}
                  />
                  <ContainerErrors errors={form.errors} name="settings.config_default_product_weight" />
                </React.Fragment>
              )}
            </Field>
          </Grid>
          <Grid item xs={12} lg={6} md={6}>
            <Field name="settings.config_default_product_length">
              {({ field, form }: FieldProps) => (
                <CurrencyTextField
                  suffix=" cm"
                  className={classes.currencyinput}
                  label="Comprimento"
                  thousandSeparator="."
                  decimalSeparator="."
                  onChange={({ floatValue }) => form.setFieldValue('settings.config_default_product_length', floatValue)}
                  value={field.value}
                />
              )}
            </Field>
          </Grid>
          <Grid item xs={12} lg={6} md={6}>
            <Field name="settings.config_default_product_width">
              {({ field, form }: FieldProps) => (
                <CurrencyTextField
                  suffix=" cm"
                  className={classes.currencyinput}
                  label="Largura"
                  thousandSeparator="."
                  decimalSeparator="."
                  onChange={({ floatValue }) => form.setFieldValue('settings.config_default_product_width', floatValue)}
                  value={field.value}
                />
              )}
            </Field>
          </Grid>
          <Grid item xs={12} lg={6} md={6}>
            <Field name="settings.config_default_product_height">
              {({ field, form }: FieldProps) => (
                <CurrencyTextField
                  suffix=" cm"
                  className={classes.currencyinput}
                  label="Altura"
                  thousandSeparator="."
                  decimalSeparator="."
                  onChange={({ floatValue }) => form.setFieldValue('settings.config_default_product_height', floatValue)}
                  value={field.value}
                />
              )}
            </Field>
          </Grid>

          <Grid item xs={12} lg={6} md={6}>
            <Field name="settings.config_best_shipping_free_from">
              {({ field, form }: FieldProps) => (
                <CurrencyTextField
                  prefix="R$ "
                  className={classes.currencyinput}
                  label="Grátis a partir"
                  thousandSeparator="."
                  decimalSeparator=","
                  onChange={({ floatValue }) => form.setFieldValue('settings.config_best_shipping_free_from', floatValue)}
                  value={field.value}
                />
              )}
            </Field>
          </Grid>
          <Grid item xs={12} lg={6} md={6} />
          <Grid item>
            <Button variant="contained" type="submit" color="primary">
              Solicitar Autorização
            </Button>
          </Grid>
        </Grid>
        <Box mt={2}>
          <Link
            href={`https://mypharmasupport.zendesk.com/hc/pt-br/search?utf8=%E2%9C%93&query=${'integrar com melhor envio'.replaceAll(
              ' ',
              '+'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Saber mais sobre como integrar com Melhor envio
          </Link>
        </Box>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(AuthorizationForm)
