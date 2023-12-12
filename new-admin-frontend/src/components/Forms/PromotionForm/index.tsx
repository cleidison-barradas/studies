import React, { Component } from 'react'
import {
  Box, Checkbox, Chip, CircularProgress, FormControl, FormControlLabel, Grid, MenuItem,
  TextField, Typography, withStyles
} from '@material-ui/core'
import { Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab'
import { floatToBRL } from '../../../helpers/moneyFormat'
import { Field, FieldArray, FieldArrayRenderProps, FieldProps, FormikErrors } from 'formik'
// interfaces
import Product from '../../../interfaces/product'
// Custom Inputs
import DatePicker from '../../CustomDatePicker'
import ContainerErrors from '../../ContainerErrors'
import CurrencyTextField from '../../CurrencyTextField'
import style from './style'
import Classification from '../../../interfaces/classification'
import Category from '../../../interfaces/category'
import SelectFormField from '../../SelectFormField'
import Specials from '../../../interfaces/specialPrice'
import SwitchFormField from '../../SwitchFormField'
import moment from 'moment'

type Props = {
  mode: any
  products: Product[]
  categories: Category[]
  classifications: Classification[]
  fetching?: boolean
  product?: Product | null
  loadProducts: (data: any) => void
  loadCategories: (data?: any) => void
  loadClassifications: (data?: any) => void
  errors: FormikErrors<Product | Category | Classification | Specials | undefined>
  classes: Record<keyof ReturnType<typeof style>, string>
  promotionId?: string
}
class PromotionForm extends Component<Props> {
  static defaultProps = {
    product: null,
    products: [],
    categories: [],
    classifications: [],
    fetching: false,
    errors: {},
  }

  render() {
    const { classes, products, product, fetching, errors,
      categories, classifications, promotionId, loadProducts, loadCategories, loadClassifications } = this.props
    return (
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} sm={6}>
            <Grid item md={4}>
              <Box mt={3} mb={3}>
                {!promotionId && (<Field
                  name="typePromotion"
                  label="Tipo de promoção"
                  component={SelectFormField}
                  className={classes.select}
                >
                  <MenuItem value="product">Produto</MenuItem>
                  <MenuItem value="category">Categoria</MenuItem>
                  <MenuItem value="classification">Classificação</MenuItem>
                </Field>)}
              </Box>
            </Grid>
            <Field name="typePromotion">
              {({ field }: FieldProps) => field.value && field.value.includes('product') && (
                <section className={classes.section}>
                  <Grid item xs={12} md={8} sm={6}>
                    {!promotionId && (
                      <Field name="product">
                        {({ field, form }: FieldProps) => (
                          <React.Fragment>
                            <Autocomplete
                              clearOnBlur
                              selectOnFocus
                              options={products}
                              value={field.value}
                              defaultValue={field.value}
                              getOptionLabel={(option: Product) => `${option?.name} - ${option?.EAN} - ${floatToBRL(option?.price)}`}
                              renderInput={(params: AutocompleteRenderInputParams) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  label="Produto"
                                  placeholder="Procure o produto"
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                      <React.Fragment>
                                        {fetching && <CircularProgress color="primary" size={20} />}
                                        {params.InputProps.endAdornment}
                                      </React.Fragment>
                                    ),
                                  }}
                                />
                              )}
                              onInputChange={(e: React.ChangeEvent<{}>, value: string) => {
                                loadProducts({ query: value })
                              }}
                              onChange={(field: any, value: Product | null) => {
                                if (value) {
                                  form.setFieldValue('product', value)
                                } else {
                                  form.setFieldValue('product', null)
                                }
                              }}
                            />
                            <ContainerErrors errors={errors} name="product" />
                          </React.Fragment>
                        )}
                      </Field>)}
                    {product && <Chip label={product.name + ', EAN ' + product.EAN + ', ' + floatToBRL(product.price)} />}
                  </Grid>
                </section>
              )}
            </Field>
            <Field name="typePromotion">
              {({ field }: FieldProps) => field.value && field.value.includes('category') && (
                <section className={classes.section}>
                  <Grid item xs={12} md={8} sm={6}>
                    <FieldArray
                      name="category"
                      render={({ form }: FieldArrayRenderProps) => (
                        <React.Fragment>
                          <Autocomplete
                            multiple
                            clearOnBlur
                            selectOnFocus
                            disabled={form.values.AllChecked}
                            limitTags={20}
                            loading={fetching}
                            options={categories}
                            getOptionDisabled={(option: Category) =>
                              form.values.category.find((category: Category) => category._id === option._id)
                                ? true
                                : false
                            }
                            getOptionLabel={(op: any) => op.name}
                            value={form.values.category}
                            onChange={(ev: React.ChangeEvent<{}>, category: Category[]) => {
                              if (category) {
                                const categoryData = category.map(c => {
                                  return {
                                    _id: c._id,
                                    name: c.name
                                  }
                                })
                                form.setFieldValue('category', categoryData)
                              }
                              else {
                                form.setFieldValue('category', [])
                              }
                            }
                            }
                            renderTags={(tagValue, getTagProps) =>
                              tagValue.map((option, index) => <Chip key={index} label={option.name} {...getTagProps({ index })} />)
                            }
                            renderInput={(params: AutocompleteRenderInputParams) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                label="Categoria"
                                placeholder="Procure a categoria"
                                multiline
                                onChange={(e) => loadCategories({ name: e.target.value })}
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <React.Fragment>
                                      {fetching && <CircularProgress color="primary" size={20} />}
                                      {params.InputProps.endAdornment}
                                    </React.Fragment>
                                  ),
                                }}
                              />
                            )}

                          />
                          <ContainerErrors errors={errors} name="category" />
                          <Field
                            name="quantityBlock"
                            label="Criar promoção só para produtos com estoque?"
                            labelPlacement="end"
                            component={SwitchFormField}
                            style={{ display: 'inline-flex' }}
                          />
                          <FormControl>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name="AllChecked"
                                  checked={form.values.category.length === categories.length && categories.length > 0}
                                  onChange={() => {
                                    if (form.values.category.length === categories.length) {
                                      form.setFieldValue('category', [])
                                      form.setFieldValue('AllChecked', !form.values.AllChecked)
                                    } else {
                                      if (form.values.category) {
                                        const categoryData = categories.map(c => {
                                          return {
                                            _id: c._id,
                                            name: c.name
                                          }
                                        })
                                        form.setFieldValue('category', categoryData)
                                        form.setFieldValue('AllChecked', !form.values.AllChecked)
                                      }
                                    }
                                  }
                                  }
                                />
                              }
                              label="Adicionar todas as categorias"
                              labelPlacement="start"
                              style={{ display: 'inline-flex', width: '130%' }}

                            />
                          </FormControl>
                        </React.Fragment>
                      )}
                    />
                  </Grid>
                </section>
              )}
            </Field>
            <Field name="typePromotion">
              {({ field }: FieldProps) => field.value && field.value.includes('classification') && (
                <section className={classes.section}>
                  <Grid item xs={12} md={8} sm={6}>
                    <FieldArray name="classification"
                      render={({ form }: FieldArrayRenderProps) => (
                        <React.Fragment>
                          <Autocomplete
                            multiple
                            clearOnBlur
                            selectOnFocus
                            loading={fetching}
                            disabled={form.values.AllChecked}
                            value={form.values.classification}
                            getOptionDisabled={(option: Classification) =>
                              form.values.classification.find((classification: Classification) => classification._id === option._id)
                                ? true
                                : false
                            }
                            options={classifications}
                            getOptionLabel={(op: Classification) => op.name}
                            onChange={(ev: React.ChangeEvent<{}>, classification: Classification[]) => {
                              if (classification) {
                                const classificationData = classification.map(c => {
                                  return {
                                    _id: c._id,
                                    name: c.name
                                  }
                                })
                                form.setFieldValue('classification', classificationData)
                              }
                              else {
                                form.setFieldValue('classification', [])
                              }
                            }}
                            renderTags={(tagValue, getTagProps) =>
                              tagValue.map((option, index) => <Chip key={index} label={option.name} {...getTagProps({ index })} />)
                            }
                            renderInput={(params: AutocompleteRenderInputParams) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                label="Classificação"
                                placeholder="Procure a classificação"
                                multiline
                                onChange={(e) => loadClassifications({ name: e.target.value })}
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <React.Fragment>
                                      {fetching && <CircularProgress color="primary" size={20} />}
                                      {params.InputProps.endAdornment}
                                    </React.Fragment>
                                  ),
                                }}
                              />
                            )}
                          />
                          <ContainerErrors errors={errors} name="classification" />
                          <Field
                            name="quantityBlock"
                            label="Criar promoção só para produtos com estoque?"
                            labelPlacement="end"
                            component={SwitchFormField}
                            style={{ display: 'inline-flex' }}
                          />
                          <FormControl>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name="AllChecked"
                                  checked={form.values.classification.length === classifications.length && classifications.length > 0}
                                  onChange={() => {
                                    if (form.values.classification.length === classifications.length) {
                                      form.setFieldValue('classification', [])
                                      form.setFieldValue('AllChecked', !form.values.AllChecked)
                                    } else {
                                      if (form.values.classification) {
                                        const classificationData = classifications.map(c => {
                                          return {
                                            _id: c._id,
                                            name: c.name
                                          }
                                        })
                                        form.setFieldValue('classification', classificationData)
                                        form.setFieldValue('AllChecked', !form.values.AllChecked)
                                      }
                                    }
                                  }
                                  }
                                />
                              }
                              label="Adicionar todas as classificações"
                              labelPlacement="start"
                              style={{ display: 'inline-flex', width: '120%' }}
                            />
                          </FormControl>
                        </React.Fragment>
                      )}
                    />
                  </Grid>
                </section>
              )}
            </Field>
            <Field name="typePromotion">
              {({ field }: FieldProps) => field.value && field.value.includes('product') && (
                <Grid item md={4}>
                  <Box mt={3} mb={3} >
                    <Field
                      name="typeDiscount"
                      label="Tipo de desconto"
                      component={SelectFormField}
                      className={classes.select}
                    >
                      <MenuItem value="pricePromotion">Valor promocional</MenuItem>
                      <MenuItem value="discountPromotion">Desconto percentual</MenuItem>
                    </Field>
                  </Box>
                </Grid>
              )}
            </Field>
            <Typography className={classes.boldtitle}>Validade da Promoção</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={2} md={3}>
            <Field name="date_start">
              {({ field, form }: FieldProps) => (
                <React.Fragment>
                  <DatePicker
                    label="Inicia em"
                    disablePast={true}
                    date={field.value}
                    setDate={(date: Date) => form.setFieldValue('date_start', moment(new Date(date)).startOf('day').toDate())}
                    className={classes.datepicker} />
                </React.Fragment>
              )}
            </Field>
            <ContainerErrors errors={errors} name="date_start" />
          </Grid>
          <Grid item xs={12} sm={2} md={3}>
            <Field name="date_end">
              {({ field, form }: FieldProps) => (
                <DatePicker
                  label="Finaliza em"
                  disablePast={true}
                  date={field.value}
                  setDate={(date: Date) => form.setFieldValue('date_end', moment(new Date(date)).endOf('day').toDate())}
                  className={classes.datepicker}
                />
              )}
            </Field>
            <ContainerErrors errors={errors} name="date_end" />
          </Grid>
        </Grid>
        <Field name="typePromotion">
          {({ field }: FieldProps) => field.value && field.value.includes('product') && (
            <>
              <Field name="typeDiscount">
                {({ field }: FieldProps) => field.value && field.value.includes('pricePromotion') && (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={12} sm={12} />
                    <Grid item xs={12} md={12} sm={12}>
                      <Field name="price">
                        {({ field, form }: FieldProps) => (
                          <CurrencyTextField
                            prefix="R$ "
                            value={field.value}
                            decimalSeparator=","
                            thousandSeparator="."
                            label="Preço da promoção"
                            className={classes.currencyinput}
                            onChange={({ floatValue }) => form.setFieldValue('price', floatValue)}
                          />
                        )}
                      </Field>
                      <ContainerErrors errors={errors} name="price" />
                    </Grid>
                    <Grid item xs={12} md={12} sm={12} />
                  </Grid>
                )}
              </Field>
            </>
          )}
        </Field>
        <Field name="typePromotion">
          {({ field }: FieldProps) => field.value && field.value.includes('product') && (
            <>
              <Field name="typeDiscount">
                {({ field }: FieldProps) => field.value && field.value.includes('discountPromotion') && (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={12} sm={12} />
                    <Grid item xs={12} md={12} sm={12}>
                      <Field name="discountPercentage">
                        {({ field, form }: FieldProps) => (
                          <CurrencyTextField
                            prefix="% "
                            value={field.value}
                            thousandSeparator="."
                            label="Percentual de promoção"
                            className={classes.currencyinput}
                            onChange={({ floatValue }) => form.setFieldValue('discountPercentage', floatValue)}
                          />
                        )}
                      </Field>
                      <ContainerErrors errors={errors} name="discountPercentage" />
                    </Grid>
                    <Grid item xs={12} md={12} sm={12} />
                  </Grid>
                )}
              </Field>
            </>
          )}
        </Field>
        <Field name="typePromotion">
          {({ field }: FieldProps) => field.value && (field.value.includes('category') ||
            field.value.includes('classification')) ? (
            <>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12} sm={12} />
                <Grid item xs={12} md={12} sm={12}>
                  <Field name="discountPercentage">
                    {({ field, form }: FieldProps) => (
                      <CurrencyTextField
                        prefix="% "
                        value={field.value}
                        thousandSeparator="."
                        label="Percentual de promoção"
                        className={classes.currencyinput}
                        onChange={({ floatValue }) => form.setFieldValue('discountPercentage', floatValue)}
                      />
                    )}
                  </Field>
                  <ContainerErrors errors={errors} name="discountPercentage" />
                </Grid>
                <Grid item xs={12} md={12} sm={12} />
              </Grid>
            </>
          ) : null}
        </Field>
      </div >
    )
  }
}

export default withStyles(style)(PromotionForm)


