import { Box, Button, Chip, Grid, TextField, Typography, withStyles } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { Field, FieldProps, FormikErrors } from 'formik'
import { debounce } from 'lodash'
import React, { Component } from 'react'
import InputMask from 'react-input-mask'
import { PlanConsumer } from '../../../context/PlanContext'
import { PmcConsumer } from '../../../context/PmcContext'
import { UserConsumer } from '../../../context/UserContext'
import { validateCEP } from '../../../helpers/validate-cep'
import Plan from '../../../interfaces/plan'
import Pmc from '../../../interfaces/pmc'
import User from '../../../interfaces/user'
import CepFormField from '../../CepFormField'
import ContainerErrors from '../../ContainerErrors'
import PaperBlock from '../../PaperBlock'
import SwitchFormField from '../../SwitchFormField'
import TextFormField from '../../TextFormField'
import styles from './styles'

interface Props {
  errors: FormikErrors<any>
  handleDialog: () => void
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class NewStoreForm extends Component<Props> {
  render() {
    const { errors, classes, handleDialog } = this.props
    return (
      <PmcConsumer>
        {({ pmcs }) => (
          <UserConsumer>
            {({ getUsers, users }) => (
              <PlanConsumer>
                {({ plans }) => (
                  <React.Fragment>
                    <PaperBlock title="Dados cadastrais">
                      <Grid container spacing={3}>
                        <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
                          <Field name="store.name" autoComplete="off" label="Nome da loja" component={TextFormField} />
                        </Grid>
                        <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
                          <Field
                            name="store.settings.config_owner"
                            autoComplete="off"
                            label="Proprietário"
                            component={TextFormField}
                          />
                        </Grid>
                        <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
                          <Field
                            name="store.settings.config_email"
                            label="Email"
                            autoComplete="off"
                            component={TextFormField}
                          />
                        </Grid>
                        <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
                          <Field
                            name="store.settings.config_phone"
                            label="Telephone"
                            autoComplete="off"
                            component={TextFormField}
                          />
                        </Grid>
                        <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
                          <Field
                            name="store.settings.config_cnpj"
                            label="Cnpj"
                            autoComplete="off"
                            component={TextFormField}
                          />
                        </Grid>
                        <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
                          <Field
                            name="store.settings.config_address"
                            label="Endereço"
                            autoComplete="off"
                            component={TextFormField}
                          />
                        </Grid>
                        <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
                          <Field name="store.settings.config_cep">
                            {({ field, form }: FieldProps) => (
                              <>
                                <InputMask
                                  value={field.value}
                                  mask="99999-999"
                                  autoComplete="off"
                                  onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                    const onlyNums = event.target.value.replace(/[^0-9]/g, '')

                                    form.setFieldValue('store.settings.config_cep', onlyNums)

                                    const addressByCep = await validateCEP(onlyNums)

                                    if (!addressByCep) {
                                      form.setFieldError('store.settings.config_cep', 'CEP inválido')
                                    }
                                  }}
                                >
                                  {(inputProps: any) => (
                                    <CepFormField label="CEP" field={field} form={form} {...inputProps} />
                                  )}
                                </InputMask>
                              </>
                            )}
                          </Field>
                        </Grid>
                      </Grid>
                    </PaperBlock>
                    <PaperBlock title="SSL">
                      <Grid container spacing={3}>
                        <Grid item lg={6} md={12} xs={12} sm={12} xl={6}>
                          <Field name="store.url" label="URL da loja" autoComplete="off" component={TextFormField} />
                        </Grid>
                        <Grid item lg={6} md={12} xs={12} sm={12} xl={6}>
                          <Field
                            name="store.settings.config_ssl"
                            label="SSL da loja"
                            autoComplete="off"
                            component={TextFormField}
                          />
                        </Grid>
                      </Grid>
                    </PaperBlock>
                    <PaperBlock title="Usuários">
                      <Field
                        name="users"
                        render={({ form }: FieldProps) => (
                          <React.Fragment>
                            <Autocomplete
                              options={users}
                              multiple
                              clearOnBlur={false}
                              getOptionLabel={(user: User) => user.userName}
                              getOptionDisabled={(user: User) =>
                                !!form.values.users.find((value: User['_id']) => value === user._id!)
                              }
                              onChange={(ev: any, values: User[]) =>
                                form.setFieldValue(
                                  'users',
                                  values.map((user) => user._id)
                                )
                              }
                              onInputChange={debounce(async (_, query) => {
                                await getUsers({ query })
                              }, 500)}
                              renderInput={(params) => (
                                <TextField {...params} label="Procure um usuário" variant="outlined" />
                              )}
                            />
                            <Box mt={2}>
                              <Button className={classes.addnewbtn} onClick={handleDialog}>
                                Adicione um novo usuário
                              </Button>
                            </Box>
                          </React.Fragment>
                        )}
                      />
                    </PaperBlock>
                    <PaperBlock title="Planos">
                      <Grid container spacing={3}>
                        <Grid item lg={6} md={12} xs={12} sm={12} xl={6}>
                          <Field
                            name="store.plan"
                            render={({ form }: FieldProps) => (
                              <React.Fragment>
                                <Autocomplete
                                  options={plans}
                                  clearOnBlur={false}
                                  getOptionLabel={(plan: Plan) => plan.name}
                                  getOptionDisabled={(plan) =>
                                    form.values.plan && form.values.plan._id === plan._id ? true : false
                                  }
                                  onChange={(ev: any, plan: Plan | null) => {
                                    if (plan) {
                                      form.setFieldValue('store.plan', plan)
                                    } else {
                                      form.setFieldValue('store.plan', null)
                                    }
                                  }}
                                  renderInput={(params) => (
                                    <TextField {...params} label="Selecione um plano" variant="outlined" />
                                  )}
                                />
                                <Typography style={{ marginTop: 5 }}>
                                  Plano atual{' '}
                                  {form.values.store && form.values.store.plan && (
                                    <Chip label={form.values.store.plan.name} />
                                  )}
                                </Typography>
                              </React.Fragment>
                            )}
                          />
                          <ContainerErrors name="plan" errors={errors} />
                        </Grid>
                      </Grid>
                    </PaperBlock>
                    <PaperBlock title="Extras">
                      <Grid container spacing={3}>
                        <Grid item lg={6} md={12} xs={12} sm={12} xl={4}>
                          <Field
                            name="store.pmc"
                            render={({ form }: FieldProps) => (
                              <React.Fragment>
                                <Autocomplete
                                  options={pmcs}
                                  clearOnBlur={false}
                                  getOptionLabel={(pmc) => pmc.name}
                                  getOptionDisabled={(pmc) =>
                                    form.values.pmc && form.values.pmc._id === pmc._id ? true : false
                                  }
                                  onChange={(ev: any, pmc: Pmc | null) => {
                                    if (pmc) {
                                      form.setFieldValue('store.pmc', pmc)
                                    } else {
                                      form.setFieldValue('store.pmc', null)
                                    }
                                  }}
                                  renderInput={(params) => (
                                    <TextField {...params} label="PMC da loja" variant="outlined" />
                                  )}
                                />
                                <Typography style={{ marginTop: 5 }}>
                                  PMC atual{' '}
                                  {form.values.store && form.values.store.pmc && (
                                    <Chip label={form.values.store.pmc.name} />
                                  )}
                                </Typography>
                              </React.Fragment>
                            )}
                          />
                        </Grid>
                        <Grid item lg={6} md={12} xs={12} sm={12} xl={4}>
                          <Field name="store.tenant" label="tenant" component={TextFormField} disabled />
                        </Grid>
                        <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
                          <Field
                            name="store.settings.config_eurofarma_partner"
                            label="Exibir logo da Eurofarma?"
                            component={SwitchFormField}
                          />
                        </Grid>
                        <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
                          <Field
                            name="store.mainStore"
                            label="Definir como loja matriz ?"
                            component={SwitchFormField}
                          />
                        </Grid>
                        <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
                          <Field
                            name="store.settings.config_new_layout"
                            label="Novo layout ?"
                            component={SwitchFormField}
                          />
                        </Grid>
                      </Grid>
                    </PaperBlock>
                  </React.Fragment>
                )}
              </PlanConsumer>
            )}
          </UserConsumer>
        )}
      </PmcConsumer>
    )
  }
}

export default withStyles(styles)(NewStoreForm)
