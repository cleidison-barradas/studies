    import React, { Component } from 'react'
    import {
      Box,
      Button,
      Dialog,
      DialogContent,
      FormControl,
      Typography,
      withStyles,
    } from '@material-ui/core'

    import  blueExclamationIcon from '../../assets/images/blueExclamationIcon.svg'

    import styles from './styles'
    import { Field, FieldProps, Form, Formik } from 'formik'
    import Store from '../../interfaces/store'

    import * as yup from 'yup'
    import { validateCEP } from '../../helpers/validate-cep'
    import ContainerErrors from '../ContainerErrors'
    import TextFormField from '../TextFormField'
    import TextFormMasked from '../TextFormMasked'

    interface Props {
      classes: Record<keyof ReturnType<typeof styles>, string>
      isOpen: boolean
      onClose: () => void
      store: Store | null
      requestaddSettings: (store: Store) => Promise<void>
    }

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

    interface State {
      showAddressForm: boolean
    }

    class CustomAddressDialog extends Component<Props, State> {
      state: State = {
        showAddressForm: false
      }

      handleSubmit = () => {
        const { onClose } = this.props

        if(!this.state.showAddressForm) {
          this.setState({ showAddressForm: true })
        }
        else{
          onClose()
        }
      }

      validationSchema = yup.object({
        name: yup.string().required(),
        settings: yup.object({
          config_company_name: yup.string(),
          config_name: yup.string().required(),
          config_cnpj: yup.string().required('CNPJ obrigatório'),
          config_address: yup.string().required(),
          config_responsible_name: yup.string().required('Farmaceutico obrigatório'),
          config_cep: yup.string().required('CEP obrigatório'),
          config_store_city: yup.string().required(),
          config_email: yup.string().required('email obrigatório'),
          config_store_number: yup.string().required(),
          config_phone: yup.string(),
          config_whatsapp_phone: yup.string(),
          config_pharmacist_crf: yup.string().required('CRF obrigatório'),
          config_pharmacist_name: yup.string(),
          config_hide_prices: yup.boolean(),
          config_social_login: yup.boolean(),
          config_stock_display: yup.boolean(),
          config_pickup_in_store: yup.boolean(),
        }),
      })
      render() {
        const { classes, isOpen, onClose, store, requestaddSettings } = this.props
        const { showAddressForm } = this.state

        const submitButtonType = showAddressForm ? 'submit' : 'button'

        return (
          <Dialog
            open={isOpen}
            maxWidth='md'
            className={classes.dialog}
          >
            <DialogContent className={classes.content}>
              <Box style={{ display: 'flex', flexDirection: 'column', minWidth: 56, maxWidth: '8%' }}>
                <img
                  className={classes.image}
                  src={blueExclamationIcon}
                  alt='exclamation icon'
                />
              </Box>
              <Box className={classes.texts}>
                <Typography className={classes.title} color='primary'>
                  Atualize seus Dados!
                </Typography>
                <Typography>
                Por motivos técnicos ao habilitar esta programação de entrega, precisamos que atualize seus dados.
                </Typography>

                <Formik validationSchema={this.validationSchema} initialValues={store!} enableReinitialize onSubmit={requestaddSettings}>
            {({ values, isSubmitting, isValid, errors }) => (
              <Form>
                {showAddressForm &&
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
              }
              <Box className={classes.buttons}>
                 <Button
                    className={classes.cancelButton}
                    variant='outlined'
                    onClick={onClose}
                 >
                   Cancelar
                 </Button>
                 <Button
                   className={classes.acceptButton}
                   variant='contained'
                   onClick={this.handleSubmit}
                   type={submitButtonType}
                   color='primary'
                 >
                   Atualizar
                 </Button>
              </Box>
          </Form>
          )}
          </Formik>

              </Box>
            </DialogContent>
          </Dialog>
        )
      }
    }

    export default withStyles(styles)(CustomAddressDialog)