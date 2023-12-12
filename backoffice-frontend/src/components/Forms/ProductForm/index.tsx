import React, { Component } from 'react'
import { Grid, Typography, withStyles, TextField, MenuItem, Divider, Chip } from '@material-ui/core'
import CurrencyField from 'react-currency-input'

import PaperBlock from '../../PaperBlock'
import ProductImage from '../ProductImage'
import ProductDescriptionEditor from '../../ProductDescriptionEditor'

import styles from './styles'

import { ReactComponent as Elipse } from '../../../assets/images/icons/greyElipse.svg'
import { ReactComponent as GreenElipse } from '../../../assets/images/icons/greenElipse.svg'

import Store from '../../../interfaces/store'
import Control from '../../../interfaces/control'
import Category from '../../../interfaces/category'
import Manufacturer from '../../../interfaces/manufacturer'
import Classification from '../../../interfaces/classification'

import { Field, FieldArray, FieldArrayRenderProps, FieldProps } from 'formik'
import TextFormField from '../../TextFormField'
import SelectFormField from '../../SelectFormField'
import { Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab'
import { ManufacturerConsumer } from '../../../context/ManufacturerContext'
import { GetCategoryRequest } from '../../../services/api/interfaces/ApiRequest'
import { debounce } from 'lodash'

type Props = {
  store?: Store
  controls: Control[]
  categories: Category[]
  manufacturers: Manufacturer[]
  classifications: Classification[]
  categorySearch: (data?: GetCategoryRequest) => void
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class ProductForm extends Component<Props> {
  render() {
    const { classes, controls, categories, classifications, categorySearch } = this.props
    return (
      <React.Fragment>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={9} md={12}>
            <div>
              <PaperBlock>
                {/* ProductMainInfo */}

                <section className={classes.section}>
                  <Typography className={classes.title}>Produto</Typography>
                  <Grid container alignItems="center" spacing={3}>
                    <Grid item xs={12} lg={4} md={4}>
                      <Field
                        classes={{
                          root: classes.textfield,
                        }}
                        label="EAN"
                        name="EAN"
                        component={TextFormField}
                      />
                    </Grid>
                    <Grid item xs={12} lg={4} md={4}>
                      <Field
                        className={classes.textfield}
                        component={TextFormField}
                        label="Nome"
                        name="name"
                        autoComplete="off"
                      />
                    </Grid>
                    <Grid item xs={12} lg={4} md={4}>
                      <Field
                        fullWidth
                        classes={{
                          root: classes.textfield,
                        }}
                        component={TextFormField}
                        label="Apresentação"
                        name="presentation"
                        autoComplete="off"
                      />
                    </Grid>
                  </Grid>
                </section>
                <section>
                  <Typography className={classes.title}>Descrição</Typography>
                  <Field name="description">
                    {({ field, form }: FieldProps) => (
                      <ProductDescriptionEditor
                        setDescription={(description: string) => form.setFieldValue('description', description)}
                        description={field.value}
                      />
                    )}
                  </Field>
                </section>
              </PaperBlock>
            </div>
            <div>
              <ProductImage classes={classes} />
            </div>

            {/* Product Config */}

            <div>
              <PaperBlock>
                <section className={classes.section}>
                  <Typography className={classes.title}>Mais configurações</Typography>
                  <Grid container alignItems="center" spacing={3}>
                    <Grid item xs={12} lg={6} md={6}>
                      <Field
                        classes={{
                          root: classes.textfield,
                        }}
                        label="Código MS"
                        name="MS"
                        component={TextFormField}
                        autoComplete="off"
                      />
                    </Grid>
                    <Grid item xs={12} lg={6} md={6}>
                      <Field
                        classes={{
                          root: classes.textfield,
                        }}
                        component={TextFormField}
                        label="Princípio Ativo"
                        name="activePrinciple"
                        autoComplete="off"
                      />
                    </Grid>
                    <Grid item xs={12} lg={4} md={4}>
                      <Field
                        classes={{
                          root: classes.textfield,
                        }}
                        label="Estoque"
                        name="quantity"
                        type="number"
                        component={TextFormField}
                        autoComplete="off"
                      />
                    </Grid>
                    <Grid item xs={12} lg={4} md={4}>
                      <Field name="control" label="Controle" component={SelectFormField}>
                        {controls.map((control: Control) => (
                          <MenuItem key={control._id} value={control._id}>
                            {control.description} - {control.initials}
                          </MenuItem>
                        ))}
                      </Field>
                    </Grid>
                    <Grid item xs={12} lg={4} md={4}>
                      <Field name="classification" label="Classificação" component={SelectFormField}>
                        {classifications.map((classification: Classification) => (
                          <MenuItem key={classification._id} value={classification._id}>
                            {classification.name}
                          </MenuItem>
                        ))}
                      </Field>
                    </Grid>
                    <Grid item xs={12} lg={6} md={6}>
                      <Field name="price">
                        {({ field, form }: FieldProps) => (
                          <CurrencyField
                            className={classes.currencyinput}
                            placeholder="Preço do produto"
                            prefix="R$ "
                            decimalSeparator=","
                            thousandSeparator="."
                            value={field.value}
                            name="price"
                            onChangeEvent={(_: any, maskedValue: any, floatValue: number) => {
                              form.setFieldValue('price', floatValue)
                            }}
                          />
                        )}
                      </Field>
                    </Grid>
                  </Grid>
                </section>
              </PaperBlock>
            </div>

            {/* Product Visualization */}

            <div>
              <PaperBlock>
                <Typography className={classes.title}>Pré-visualização da listagem de mecanismo de pesquisa</Typography>
                <Typography className={classes.caption}>
                  Adicione um título e uma descrição para visualizar como produto pode aparecer em uma listagem de
                  mecanismo de pesquisa
                </Typography>
                <Divider className={classes.divider} />
                <section className={classes.section}>
                  <Field name="metaTitle">
                    {({ field, form }: FieldProps) => (
                      <TextField
                        fullWidth
                        name="metaTitle"
                        autoComplete="off"
                        variant="outlined"
                        value={field.value}
                        label="Título da página"
                        onChange={form.handleChange}
                        error={!!form.errors.metaTitle}
                        helperText={form.errors.metaTitle}
                        classes={{
                          root: classes.textfield,
                        }}
                      />
                    )}
                  </Field>
                </section>
                <section className={classes.section}>
                  <Field name="metaDescription">
                    {({ field, form }: FieldProps) => (
                      <TextField
                        rows={3}
                        multiline
                        fullWidth
                        label="Descrição"
                        autoComplete="off"
                        variant="outlined"
                        value={field.value}
                        name="metaDescription"
                        onChange={form.handleChange}
                        error={!!form.errors.metaDescription}
                        classes={{
                          root: classes.textarea,
                        }}
                        helperText={form.errors.metaDescription}
                        inputProps={{
                          maxLength: 320,
                        }}
                      />
                    )}
                  </Field>
                </section>
                <section className={classes.section}>
                  <Field name="slug" style={{ width: '100%' }}>
                    {({ field }: FieldProps) => (
                      <TextField
                        fullWidth
                        classes={{
                          root: classes.textfield,
                        }}
                        variant="outlined"
                        label="URL"
                        disabled
                        value={field.value && field.value.pop()}
                      />
                    )}
                  </Field>
                </section>
              </PaperBlock>
            </div>
          </Grid>
          <Grid item lg={3} md={12}>
            {/* Product Status */}
            <div>
              <PaperBlock>
                <Typography className={classes.title}>Status do Produto</Typography>
                <section className={classes.section}>
                  <Field name="status" label="Status" component={SelectFormField}>
                    <MenuItem value="false">Não publicado</MenuItem>
                    <MenuItem value="true">Publicado</MenuItem>
                  </Field>
                </section>
                <section className={classes.section}>
                  <Typography className={classes.boldtext}>canais de vendas e apps</Typography>
                </section>
                <section className={classes.section}>
                  {
                    <Field name="status">
                      {({ field }: FieldProps) => (
                        <React.Fragment>
                          <section className={classes.section}>
                            <Grid alignItems="center" container>
                              {field.value ? <GreenElipse /> : <Elipse />}
                              <Typography className={classes.sellingchanneltext}>
                                Loja Virtual - MyPharma PRO
                              </Typography>
                            </Grid>
                          </section>
                          <Grid alignItems="center" container>
                            {field.value ? <GreenElipse /> : <Elipse />}
                            <Typography className={classes.sellingchanneltext}>App MyPharma PRO</Typography>
                          </Grid>
                        </React.Fragment>
                      )}
                    </Field>
                  }
                </section>
              </PaperBlock>
            </div>
            {/* Product Organization */}
            <div>
              <PaperBlock>
                <Typography className={classes.title}>Organização</Typography>

                <ManufacturerConsumer>
                  {({ manufacturers, getManufacturer }) => (
                    <section className={classes.section}>
                      <Field name="manufacturer">
                        {({ form }: FieldProps) => (
                          <Autocomplete
                            options={manufacturers}
                            renderInput={(params: AutocompleteRenderInputParams) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                label="Fabricante"
                                placeholder="Procure o fabricante"
                                InputProps={{
                                  ...params.InputProps,
                                }}
                              />
                            )}
                            filterOptions={(op) => op}
                            getOptionLabel={(op: Manufacturer) => op.name}
                            onChange={(ev: any, manufacturer: Manufacturer | null) => {
                              if (manufacturer) {
                                form.setFieldValue('manufacturer', manufacturer)
                              }
                            }}
                            className={classes.autocomplete}
                            onInputChange={debounce(async (e: React.ChangeEvent<{}>, value: string) => {
                              await getManufacturer({
                                name: value,
                              })
                            }, 300)}
                          />
                        )}
                      </Field>
                      <Field name="manufacturer">
                        {({ field }: FieldProps) => (
                          <Grid container>
                            {field.value && (
                              <Grid>
                                <Chip label={field.value.name} style={{ marginTop: 10 }} />
                              </Grid>
                            )}
                          </Grid>
                        )}
                      </Field>
                    </section>
                  )}
                </ManufacturerConsumer>
                <section className={classes.section}>
                  <FieldArray
                    name="category"
                    render={({ form, push }: FieldArrayRenderProps) => (
                      <Autocomplete
                        value={form.values.category}
                        options={categories}
                        renderInput={(params: AutocompleteRenderInputParams) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label="Categoria"
                            placeholder="Procure a categoria"
                          />
                        )}
                        getOptionDisabled={(option: Category) =>
                          form.values.category.find((category: Category) => category._id === option._id) ? true : false
                        }
                        getOptionLabel={(op: Category) => op.name}
                        onChange={(ev: any, category: Category | null) => {
                          if (category) {
                            push(category)
                          }
                        }}
                        className={classes.autocomplete}
                        onInputChange={(e: React.ChangeEvent<{}>, value: any) => {
                          categorySearch({ query: value })
                        }}
                      />
                    )}
                  />
                  <FieldArray
                    name="category"
                    render={({ remove, form }: FieldArrayRenderProps) => (
                      <Grid container>
                        {form.values.category &&
                          form.values.category.map((category: Category, index: number) => (
                            <Grid key={category._id} item xs={12} sm={12} lg={12} xl={12} md={12} id={category._id}>
                              <Chip label={category.name} onDelete={() => remove(index)} style={{ marginTop: 10 }} />
                            </Grid>
                          ))}
                      </Grid>
                    )}
                  />
                </section>
              </PaperBlock>
            </div>
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(ProductForm)
