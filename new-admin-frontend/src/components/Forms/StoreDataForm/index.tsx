import { FormControl, Tooltip, withStyles } from '@material-ui/core'
import React from 'react'
import PaperBlock from '../../PaperBlock'

import { Field, FieldProps, FormikErrors } from 'formik'
import { validateCEP } from '../../../helpers/validate-cep'
import Store from '../../../interfaces/store'
import ContainerErrors from '../../ContainerErrors'
import CustomComponent from '../../CustomComponent'
import SwitchFormField from '../../SwitchFormField'
import TextFormField from '../../TextFormField'
import TextFormMasked from '../../TextFormMasked'
import styles from './styles'

type AddressByCep = {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
}

type Props = {
  mode: any
  store?: Store
  errors: FormikErrors<Store | undefined>
  classes: Record<keyof ReturnType<typeof styles>, string>
  integration: any
}

class StoreDataForm extends CustomComponent<Props> {
  static defaultProps = {
    store: undefined,
  }

  render() {
    const { classes, errors, store, integration } = this.props
    const plan = store?.plan

    const trier_integration = integration?.length > 0 ? true : false

    return (
      <React.Fragment>
        <PaperBlock>
          <div className={classes.form}>
            <FormControl className={classes.formControl50}>
              <Field
                component={TextFormField}
                label="Nome da loja"
                autoComplete="off"
                name="name"
                InputLabelProps={{
                  className: classes.label,
                }}
                classes={{
                  root: classes.fieldroot,
                }}
                inputProps={{
                  className: classes.input,
                }}
              />
            </FormControl>
            <FormControl className={classes.formControl50}>
              <Field
                autoComplete="off"
                component={TextFormField}
                name="settings.config_name"
                label="Nome de apresentação da loja"
                InputLabelProps={{
                  className: classes.label,
                }}
                classes={{
                  root: classes.fieldroot,
                }}
                inputProps={{
                  className: classes.input,
                }}
              />
            </FormControl>
            <FormControl className={classes.formControl50}>
              <Field
                component={TextFormField}
                autoComplete="off"
                label="Razão social"
                name="settings.config_company_name"
                InputLabelProps={{
                  className: classes.label,
                }}
                classes={{
                  root: classes.fieldroot,
                }}
                inputProps={{
                  className: classes.input,
                }}
              />
            </FormControl>
            <FormControl className={classes.formControl50}>
              <Field name="settings.config_cnpj">
                {({ field, form }: FieldProps) => (
                  <TextFormMasked
                    label="CNPJ"
                    value={field.value}
                    mask="99.999.999.9999-99"
                    className={classes.inputMask}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      form.setFieldValue('settings.config_cnpj', event.target.value)
                    }
                  />
                )}
              </Field>
              <ContainerErrors errors={errors?.settings} name="config_cnpj" />
            </FormControl>
            <FormControl className={classes.formControl50}>
              <Field
                component={TextFormField}
                label="Nome do responsável"
                autoComplete="off"
                name="settings.config_responsible_name"
                InputLabelProps={{
                  className: classes.label,
                }}
                classes={{
                  root: classes.fieldroot,
                }}
                inputProps={{
                  className: classes.input,
                }}
              />
            </FormControl>

            <FormControl className={classes.formControl50}>
              <Field
                component={TextFormField}
                label="URL da Loja"
                autoComplete="off"
                disabled
                name="url"
                InputLabelProps={{
                  className: classes.label,
                }}
                classes={{
                  root: classes.fieldroot,
                }}
                inputProps={{
                  className: classes.input,
                }}
              />
            </FormControl>
          </div>
        </PaperBlock>
        <PaperBlock>
          <div className={classes.form}>
            <FormControl className={classes.formControl20}>
              <Field name="settings.config_cep">
                {({ field, form }: FieldProps) => (
                  <TextFormMasked
                    label="CEP"
                    value={field.value}
                    mask="99999-999"
                    className={classes.inputMask}
                    onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                      const value = event.target.value

                      form.setFieldValue('settings.config_cep', value)

                      const addressByCep: AddressByCep = await validateCEP(value)

                      if (!addressByCep) {
                        form.setFieldError('settings.config_cep', 'CEP inválido')
                      }

                      if (addressByCep) {
                        form.setFieldValue('settings.config_store_city', addressByCep.localidade)
                        form.setFieldValue(
                          'settings.config_address',
                          `${addressByCep.logradouro}, ${addressByCep.bairro}`
                        )
                      }
                    }}
                  />
                )}
              </Field>
              <ContainerErrors errors={errors?.settings} name="config_cep" />
            </FormControl>
            <FormControl className={classes.formControl40}>
              <Field
                component={TextFormField}
                label="Cidade"
                name="settings.config_store_city"
                InputLabelProps={{
                  className: classes.label,
                }}
                classes={{
                  root: classes.fieldroot,
                }}
                inputProps={{
                  className: classes.input,
                }}
              />
            </FormControl>
            <FormControl className={classes.formControl40}>
              <Field
                component={TextFormField}
                label="Endereço"
                autoComplete="off"
                name="settings.config_address"
                InputLabelProps={{
                  className: classes.label,
                }}
                classes={{
                  root: classes.fieldroot,
                }}
                inputProps={{
                  className: classes.input,
                }}
              />
            </FormControl>
            <FormControl className={classes.formControl40}>
              <Field
                component={TextFormField}
                label="Email"
                autoComplete="off"
                name="settings.config_email"
                InputLabelProps={{
                  className: classes.label,
                }}
                classes={{
                  root: classes.fieldroot,
                }}
                inputProps={{
                  className: classes.input,
                }}
              />
            </FormControl>
            <FormControl className={classes.formControl20}>
              <Field
                component={TextFormField}
                label="Número"
                autoComplete="off"
                name="settings.config_store_number"
                InputLabelProps={{
                  className: classes.label,
                }}
                classes={{
                  root: classes.fieldroot,
                }}
                inputProps={{
                  className: classes.input,
                }}
              />
            </FormControl>
            <FormControl className={classes.formControl20}>
              <Field name="settings.config_phone">
                {({ field, form }: FieldProps) => {
                  const mask = field.value && field.value[2] === '9' ? '(99) 9 9999-9999' : '(99) 9999-9999'
                  return (
                    <TextFormMasked
                      label="Telefone"
                      value={field.value}
                      mask={mask}
                      className={classes.inputMask}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        form.setFieldValue('settings.config_phone', event.target.value)
                      }
                    />
                  )
                }}
              </Field>
              <ContainerErrors errors={errors?.settings} name="config_phone" />
            </FormControl>
            <FormControl className={classes.formControl20}>
              <Field name="settings.config_whatsapp_phone">
                {({ field, form }: FieldProps) => (
                  <TextFormMasked
                    label="Whatsapp"
                    value={field.value}
                    mask="(99) 9 9999-9999"
                    className={classes.inputMask}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      form.setFieldValue('settings.config_whatsapp_phone', event.target.value)
                    }
                  />
                )}
              </Field>
              <ContainerErrors errors={errors?.settings} name="config_whatsapp_phone" />
            </FormControl>
          </div>
        </PaperBlock>
        <PaperBlock>
          <div className={classes.form}>
            <FormControl className={classes.formControl50}>
              <Field
                component={TextFormField}
                type="number"
                autoComplete="off"
                label="CRF do Farmacêutico Responsável"
                name="settings.config_pharmacist_crf"
                InputLabelProps={{
                  className: classes.label,
                }}
                classes={{
                  root: classes.fieldroot,
                }}
                inputProps={{
                  className: classes.input,
                }}
              />
            </FormControl>
            <FormControl className={classes.formControl50}>
              <Field
                component={TextFormField}
                label="Nome do farmacêutico responsável"
                name="settings.config_pharmacist_name"
                autoComplete="off"
                InputLabelProps={{
                  className: classes.label,
                }}
                classes={{
                  root: classes.fieldroot,
                }}
                inputProps={{
                  className: classes.input,
                }}
              />
            </FormControl>
            <FormControl className={classes.formControl20}>
              <Field name="settings.config_afe">
                {({ field, form }: FieldProps) => (
                  <TextFormMasked
                    label="AFE"
                    value={field.value}
                    mask="9-9-9999-9"
                    className={classes.inputMask}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      form.setFieldValue('settings.config_afe', event.target.value)
                    }
                  />
                )}
              </Field>
              <ContainerErrors errors={errors?.settings} name="config_whatsapp_phone" />
            </FormControl>
          </div>
        </PaperBlock>
        {this.canSeeComponent(['pro', 'pro-generic', 'start', 'enterprise'], plan) && (
          <PaperBlock>
            <div className={classes.formButtons}>
              <Tooltip title={'Habilitar ou desabilitar os botões de WhatsApp em sua loja virtual'} placement="top-end">
                <FormControl className={classes.formControlButton}>
                  <Field
                    component={SwitchFormField}
                    label="Botão WhatsApp"
                    labelPlacement="end"
                    name="settings.config_whatsapp_button"
                  />
                </FormControl>
              </Tooltip>

              <Tooltip title={'Habilitar ou desabilitar os botões de telefone fixo em sua loja virtual'}>
                <FormControl className={classes.formControlButton}>
                  <Field
                    component={SwitchFormField}
                    label="Telefone para ligação"
                    labelPlacement="end"
                    name="settings.config_show_celphone"
                  />
                </FormControl>
              </Tooltip>

              {this.canSeeComponent(['pro', 'enterprise', 'pro-generic'], store?.plan) && (
                <Tooltip
                  title={
                    trier_integration === true
                      ? 'Você utiliza integração via API com o ERP Trier. Neste caso, o CPF é uma informação obrigatória, e não é possível desabilitar esta informação.'
                      : 'Habilitar ou desabilitar opção para obrigar cliente preencher CPF no checkout em sua loja virtual'
                  }
                >
                  <FormControl className={classes.formControlButton}>
                    <Field
                      component={SwitchFormField}
                      label="CPF no checkout"
                      labelPlacement="end"
                      name="settings.config_cpf_checkout"
                      disabled={trier_integration === true ? true : false}
                    />
                  </FormControl>
                </Tooltip>
              )}

              <Tooltip title={'Esconder estoque de produtos'}>
                <FormControl className={classes.formControlButton}>
                  <Field
                    component={SwitchFormField}
                    label="Esconder estoque"
                    labelPlacement="end"
                    name="settings.config_stock_display"
                  />
                </FormControl>
              </Tooltip>

              <Tooltip title={'Habilitar ou desabilitar opção de logins sociais na loja virtual'}>
                <FormControl className={classes.formControlButton}>
                  <Field
                    component={SwitchFormField}
                    label="Ativar login social"
                    labelPlacement="end"
                    name="settings.config_social_login"
                  />
                </FormControl>
              </Tooltip>
              <Tooltip title={'Habilitar ou desabilitar opção de Retirar na Loja'}>
                <FormControl className={classes.formControlButton}>
                  <Field
                    component={SwitchFormField}
                    label="Retirar na Loja"
                    labelPlacement="end"
                    name="settings.config_pickup_in_store"
                  />
                </FormControl>
              </Tooltip>
              {this.canSeeComponent(['start'], store?.plan) && (
                <Tooltip title={'Esconder preço dos produtos'}>
                  <FormControl className={classes.formControlButton}>
                    <Field
                      component={SwitchFormField}
                      label="Esconder preço dos produtos"
                      labelPlacement="end"
                      name="settings.config_hide_prices"
                    />
                  </FormControl>
                </Tooltip>
              )}
            </div>
          </PaperBlock>
        )}
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(StoreDataForm)
