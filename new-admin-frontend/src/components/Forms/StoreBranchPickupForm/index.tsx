import { Box, Button, Grid, Typography, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import TextFormField from '../../TextFormField'
import { Field, Form, Formik } from 'formik'
import styles from './styles'
import * as yup from 'yup'
import { StoreBranchPickup, StoreBranchPickupForm as formType } from '../../../interfaces/storeBranchPickup'
import { validateCEP } from '../../../helpers/validate-cep'
import { AddressByCEP } from '../../../interfaces/AddressByCEP'
import { debounce } from 'lodash'
import CustomDialog from '../../CustomDialog'

interface Props {
  classes: any
  handleSubmit: (form: formType) => void
  data?: StoreBranchPickup
  open: boolean
  setOpen: (open: boolean) => void
}

class StoreBranchPickupForm extends Component<Props> {
  static defaultProps = {}

  validationSchema = yup.object().shape({
    name: yup.string().required('Nome da filial é obrigatório !'),
    address: yup.object().shape({
      street: yup.string().required('Rua é obrigatório !'),
      complement: yup.string(),
      postcode: yup.string().required('CEP é obrigatório !'),
    }),
  })

  initialValues = {
    name: '',
    address: {
      street: '',
      complement: '',
      postcode: '',
      neighborhood: {
        name: '',
        city: {
          name: '',
          state: {
            name: '',
            code: '',
          },
        },
      },
    },
  }

  setCEP = debounce(async (value: string, setFieldValue: any, setFieldError: any) => {
    const addressCep: AddressByCEP = await validateCEP(value)

    if (!addressCep) {
      setFieldError('address.postcode', 'CEP inválido !')
      return
    }

    setFieldValue('address.street', addressCep.logradouro)
    setFieldValue('address.neighborhood.name', addressCep.bairro)
    setFieldValue('address.neighborhood.city.name', addressCep.localidade)
    setFieldValue('address.neighborhood.city.state.name', addressCep.uf)
  }, 300)

  content() {
    const { classes, handleSubmit, data, setOpen } = this.props
    return (
      <React.Fragment>
        <Formik
          validationSchema={this.validationSchema}
          onSubmit={handleSubmit}
          initialValues={data || this.initialValues}
          enableReinitialize
        >
          {({ setFieldError, setFieldValue, dirty, isValid }) => (
            <Form>
              <Grid container spacing={3} alignItems="center" style={{ marginBottom: 20, paddingInline: 10 }}>
                <div className={classes.divcontainer}>
                  <Grid container spacing={5}>
                    <Grid item xs={12} sm={12} md={12}>
                      <Grid item xs={12} sm={12} md={6}>
                        <Field
                          name="name"
                          className={classes.textfield}
                          autoComplete="off"
                          label="Nome da nova filial"
                          component={TextFormField}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>

                    <Grid item xs={12} sm={12} md={12}>
                      <Box className={classes.titlebox}>
                        <Typography className={classes.boldtitle}>Endereço</Typography>
                      </Box>
                      <Grid container xs={12} sm={12} md={12} spacing={3} alignItems="center">
                        <Grid item xs={12} sm={12} md={4}>
                          <Field
                            label="CEP"
                            name="address.postcode"
                            className={classes.textfield}
                            component={TextFormField}
                            onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                              const value = e.target.value
                              setFieldValue('address.postcode', value)
                              this.setCEP(value, setFieldValue, setFieldError)
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={12} md={5}>
                          <Field
                            name="address.neighborhood.city.name"
                            autoComplete="off"
                            label="Cidade"
                            component={TextFormField}
                            className={classes.textfield}
                            disabled
                          />
                        </Grid>

                        <Grid item xs={12} sm={12} md={3}>
                          <Field
                            name="address.neighborhood.city.state.name"
                            autoComplete="off"
                            label="Estado"
                            component={TextFormField}
                            className={classes.textfield}
                            disabled
                          />
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} style={{ margin: 0, padding: '5px 20px' }}>
                          <a
                            href="https://buscacepinter.correios.com.br/app/logradouro_bairro/index.php"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Não sei meu cep
                          </a>
                        </Grid>

                        <Grid item xs={12} sm={12} md={7}>
                          <Field
                            name="address.street"
                            autoComplete="off"
                            label="Rua"
                            component={TextFormField}
                            className={classes.textfield}
                            disabled
                          />
                        </Grid>

                        <Grid item xs={12} sm={12} md={3}>
                          <Field
                            name="address.number"
                            autoComplete="off"
                            label="Número"
                            component={TextFormField}
                            className={classes.textfield}
                          />
                        </Grid>

                        <Grid item xs={12} sm={12} md={7}>
                          <Field
                            name="address.complement"
                            autoComplete="off"
                            label="Complemento"
                            component={TextFormField}
                            className={classes.textfield}
                          />
                        </Grid>

                        <Grid item xs={12} sm={12} md={5}>
                          <Field
                            name="address.neighborhood.name"
                            autoComplete="off"
                            label="Bairro"
                            component={TextFormField}
                            className={classes.textfield}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  classes={{ root: classes.buttonsave }}
                  disabled={!dirty || !isValid}
                  onClick={() => setOpen(false)}
                >
                  Salvar
                </Button>
              </Grid>
            </Form>
          )}
        </Formik>
      </React.Fragment>
    )
  }
  render() {
    const { open, setOpen, classes } = this.props
    return (
      <CustomDialog
        title="Nova filial para retirada"
        open={open}
        closeModal={() => setOpen(false)}
        paperWidthSm={classes.paperWidthSm}
        content={() => this.content()}
      />
    )
  }
}

export default withStyles(styles)(StoreBranchPickupForm)
