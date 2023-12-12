import { Box, Grid, MenuItem, Typography, withStyles } from '@material-ui/core'
import React, { Component } from 'react'

import style from './style'
import ShowcaseDates from '../ShowcaseDates'
import ShowcaseProductsTable from '../../Tables/ShowcaseProductsTable'
import SuportLink from '../../SuportLink'
import { Field, FieldProps } from 'formik'
import TextFormField from '../../TextFormField'
import { ProductConsumer, ProductProvider } from '../../../context/ProductContext'
import PaperBlock from '../../PaperBlock'
import SwitchFormField from '../../SwitchFormField'
import { CategoryProvider, CategoryConsumer } from '../../../context/CategoryContext'
import { ManufacturerConsumer, ManufacturerProvider } from '../../../context/ManufacturerContext'
import SwitchContainer from '../../SwitchContainer'
import SelectFormField from '../../SelectFormField'
import moment from 'moment'

type Props = {
  classes: any
}

type State = {
  modal: boolean
}

const showcaseSmartTypeDescription: any = {
  mostSelled:
    'Esta vitrine inteligente adiciona à página inicial do seu site/app até 20 itens de curva A da sua loja física, ou seja, itens que mais tem quantidade em estoque, que normalmente são itens de maior saída.',
  mostSearched:
    'Esta vitrine inteligente adiciona à página inicial do seu site/app até 20 itens mais buscados por seus clientes do seu site/app.',
}

class ShowcaseForm extends Component<Props, State> {
  state: State = {
    modal: false,
  }

  closeModal = () => {
    this.setState({
      ...this.state,
      modal: false,
    })
  }

  openModal = () => {
    this.setState({
      ...this.state,
      modal: true,
    })
  }

  render() {
    const { classes } = this.props
    const { modal } = this.state

    return (
      <PaperBlock>
        <Grid container alignItems="center" spacing={2}>
          <Grid item lg={4} md={4} xs={12}>
            <Typography className={classes.title}>Vitrine</Typography>
            <Field
              fullWidth
              label="Nome"
              name="name"
              variant="outlined"
              className={classes.textfield}
              component={TextFormField}
            />
          </Grid>
          <Grid item lg={4} md={4} xs={12}>
            <Typography className={classes.title}>Status da Vitrine</Typography>
            <Field name="status">
              {(props: FieldProps) => (
                <SwitchContainer {...props} statusText={props.field.value ? 'Publicado' : 'Despublicado'} />
              )}
            </Field>
          </Grid>
          <Grid item lg={4} md={4} xs={12}>
            <Box mt={6}>
              <Field>
                {({ form }: FieldProps) => (
                  <Typography align="center" classes={{ root: classes.link }} onClick={this.openModal}>
                    {form.values.initialDate && `Início em ${moment(new Date(form.values.initialDate)).utc().startOf('day').format('LLL')
                      }`}
                    {form.values.finalDate && ` Até ${moment(new Date(form.values.finalDate)).utc().endOf('day').format('LLL')}`}
                    {!form.values.initialDate && !form.values.finalDate ? 'Adicionar programação personalizada' : ''}
                  </Typography>
                )}
              </Field>
            </Box>
          </Grid>
        </Grid>

        <Box mt={4} mb={2}>
          <Grid container spacing={2}>
            <Grid item>
              <Field name="smart">
                {(values: FieldProps) => (
                  <SwitchContainer {...values} statusText={values.field.value ? 'Vitrine automatica' : 'Vitrine manual'} />
                )}
              </Field>
            </Grid>
            <Grid item md={4}>
              <Field name="smartType">
                {(values: FieldProps) =>
                  values.form.values.smart ? (
                    <SelectFormField label="Tipo de vitrine automática" {...values}>
                      <MenuItem value="mostSearched"> Mais buscados </MenuItem>
                      <MenuItem value="mostSelled"> Campeões de venda </MenuItem>
                    </SelectFormField>
                  ) : (
                    <React.Fragment />
                  )
                }
              </Field>
            </Grid>
          </Grid>
        </Box>

        <Field>
          {({ form }: FieldProps) =>
            !form.values.smart ? (
              <React.Fragment>
                <Box mt={4} mb={2}>
                  <Typography className={classes.title}>Todos os Produtos</Typography>
                </Box>

                <Box mt={2}>
                  <ManufacturerProvider>
                    <CategoryProvider>
                      <ProductProvider>
                        <ManufacturerConsumer>
                          {({ getManufacturers }) => (
                            <CategoryConsumer>
                              {({ getCategorys }) => (
                                <ProductConsumer>
                                  {({ getProducts }) => (
                                    <ShowcaseProductsTable
                                      getManufacturers={getManufacturers}
                                      getCategorys={getCategorys}
                                      getProducts={getProducts}
                                    />
                                  )}
                                </ProductConsumer>
                              )}
                            </CategoryConsumer>
                          )}
                        </ManufacturerConsumer>
                      </ProductProvider>
                    </CategoryProvider>
                  </ManufacturerProvider>
                </Box>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Typography color="textSecondary">{showcaseSmartTypeDescription[form.values.smartType]}</Typography>
                <Box mt={2} mb={1}>
                  <Grid container spacing={4} alignItems="center">
                    <Grid item>
                      <Field
                        className={classes.textfield}
                        label="Estoque mínimo"
                        type="number"
                        fullWidth={false}
                        helperText="Quantidade minima que o produto precisa ter para entrar na vitrine"
                        name="smartFilters.quantity"
                        component={TextFormField}
                      />
                    </Grid>
                    <Grid item>
                      <Field
                        className={classes.textfield}
                        label="Permitir produtos controlados?"
                        labelPlacement="right"
                        name="smartFilters.control"
                        component={SwitchFormField}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </React.Fragment>
            )
          }
        </Field>
        <SuportLink query="nova vitrine" />
        <Field>
          {({ form }: FieldProps) => (
            <ShowcaseDates
              open={modal}
              showcase={form.values}
              closeModal={this.closeModal}
              classes={classes}
              onSave={(initialDate, finalDate) => {
                form.setFieldValue('initialDate', moment(initialDate).startOf('day').toDate())
                form.setFieldValue('finalDate', moment(finalDate).endOf('day').toDate())
              }}
            />
          )}
        </Field>
      </PaperBlock>
    )
  }
}

export default withStyles(style)(ShowcaseForm)
