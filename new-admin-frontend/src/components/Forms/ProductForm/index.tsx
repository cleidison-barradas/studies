import React, { Component } from 'react'
import {
  Grid,
  Typography,
  withStyles,
  TextField,
  MenuItem,
  Divider,
  Chip,
  CircularProgress,
  Box,
  Tooltip,
} from '@material-ui/core'
import PaperBlock from '../../PaperBlock'

import ProductImage from '../ProductImage'
// import ProductInsight from '../ProductInsight'
import ProductDescriptionEditor from '../../ProductDescriptionEditor'

import style from './style'

import { ReactComponent as Elipse } from '../../../assets/images/greyElipse.svg'
import { ReactComponent as GreenElipse } from '../../../assets/images/greenElipse.svg'

import Store from '../../../interfaces/store'
import Control from '../../../interfaces/control'
import Manufacturer from '../../../interfaces/manufacturer'
import Classification from '../../../interfaces/classification'

import { Field, FieldArray, FieldArrayRenderProps, FieldProps } from 'formik'
import TextFormField from '../../TextFormField'
import SelectFormField from '../../SelectFormField'
import SwitchFormField from '../../SwitchFormField'
import { Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab'
import { ManufacturerConsumer } from '../../../context/ManufacturerContext'
import { CategoryConsumer } from '../../../context/CategoryContext'
import { ProductControlConsumer } from '../../../context/ControlsContext'
import { ClassificationConsumer } from '../../../context/ClassificationContext'
import { FileConsumer, FileProvider } from '../../../context/FileContext'
import Category from '../../../interfaces/category'
import { decode } from 'html-entities'
import CurrencyTextField from '../../CurrencyTextField'
import ContainerErrors from '../../ContainerErrors'

type Props = {
  classes: any
  mode: any
  store?: Store
}

class ProductForm extends Component<Props> {
  render() {
    const { mode, classes, store } = this.props
    return (
      <ClassificationConsumer>
        {({ classifications }) => (
          <CategoryConsumer>
            {({ categorys, getCategorys }) => (
              <ProductControlConsumer>
                {({ productControls }) => (
                  <ManufacturerConsumer>
                    {({ getManufacturers, manufacturers, fetching }) => (
                      <React.Fragment>
                        <Grid container spacing={4}>
                          <Grid item xs={12} lg={9} md={12}>
                            <div>
                              <PaperBlock>
                                {/* ProductMainInfo */}

                                <section className={classes.section}>
                                  <Typography className={classes.title}>Produto</Typography>
                                  <Grid container spacing={3}>
                                    <Grid item xs={12} lg={4} md={4}>
                                      <Field
                                        classes={{
                                          root: classes.textfield,
                                        }}
                                        label="EAN"
                                        name="EAN"
                                        autoComplete="off"
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
                                  <FileProvider>
                                    <FileConsumer>
                                      {({requestAddImage, image}) => (
                                        <Field name="description">
                                          {({ field, form }: FieldProps) => (
                                            <ProductDescriptionEditor
                                              setDescription={(description: string) => form.setFieldValue('description', description)}
                                              description={decode(field.value, {
                                                level: 'all',
                                              })}
                                              image={image}
                                              uploadImage={requestAddImage}
                                            />
                                          )}
                                        </Field>
                                      )}
                                    </FileConsumer>
                                  </FileProvider>
                                </section>
                              </PaperBlock>
                            </div>
                            <div>
                              <ProductImage mode={mode} classes={classes} />
                            </div>

                            {/* Product Config */}

                            <div>
                              <PaperBlock>
                                <section className={classes.section}>
                                  <Typography className={classes.title}>Mais configurações</Typography>
                                  <Grid container spacing={3}>
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
                                      <Field
                                        name="control"
                                        label="Controle"
                                        component={SelectFormField}
                                        className={classes.select}
                                      >
                                        <MenuItem value={0}>Sem controle</MenuItem>
                                        {productControls.map((control: Control) => (
                                          <MenuItem key={control._id} value={control._id}>
                                            {control.description}
                                          </MenuItem>
                                        ))}
                                      </Field>
                                    </Grid>
                                    <Grid item xs={12} lg={4} md={4}>
                                      <Field
                                        name="classification"
                                        label="Classificação"
                                        component={SelectFormField}
                                        className={classes.select}
                                      >
                                        <MenuItem value={0}>Sem classificação</MenuItem>
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
                                          <React.Fragment>
                                            <CurrencyTextField
                                              prefix="R$ "
                                              value={field.value}
                                              decimalSeparator=","
                                              thousandSeparator="."
                                              label="Preço do produto"
                                              className={classes.currencyinput}
                                              onChange={({ floatValue }) => form.setFieldValue('price', floatValue)}
                                            />
                                            <ContainerErrors name="price" errors={form.errors} />
                                          </React.Fragment>
                                        )}
                                      </Field>
                                    </Grid>
                                    <Grid item xs={12} lg={6} md={6}>
                                      <Field name="pmcPrice">
                                        {({ field, form }: FieldProps) => (
                                          <React.Fragment>
                                            <CurrencyTextField
                                              prefix="R$ "
                                              value={field.value}
                                              disabled={!form.values.manualPMC}
                                              decimalSeparator=","
                                              thousandSeparator="."
                                              label="PMC do produto"
                                              className={classes.currencyinput}
                                              onChange={({ floatValue }) => form.setFieldValue('pmcPrice', floatValue)}
                                            />
                                            <ContainerErrors name="pmcPrice" errors={form.errors} />
                                          </React.Fragment>
                                        )}
                                      </Field>
                                    </Grid>
                                  </Grid>
                                </section>
                              </PaperBlock>
                            </div>

                            <div>
                              <PaperBlock>
                                <section className={classes.section}>
                                  <Typography className={classes.title}>Pesos e dimensões</Typography>
                                  <Grid container spacing={3}>
                                    <Grid item xs={12} lg={12} md={12}>
                                      <Typography className={classes.caption}>
                                        vamos usá-los para calcular o custo de envio. Pese e meça o seu produto com a embalagem (
                                        aquela que voce utiliza, não a da empresa de frete ).
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={12} lg={6} md={6}>
                                      <Field name="weight">
                                        {({ field, form }: FieldProps) => (
                                          <CurrencyTextField
                                            suffix=" kg"
                                            className={classes.currencyinput}
                                            label="Peso"
                                            precision="3"
                                            thousandSeparator="."
                                            decimalSeparator="."
                                            onChange={({ floatValue }) => form.setFieldValue('weight', floatValue)}
                                            value={field.value}
                                          />
                                        )}
                                      </Field>
                                    </Grid>
                                    <Grid item xs={12} lg={6} md={6}>
                                      <Field name="length">
                                        {({ field, form }: FieldProps) => (
                                          <CurrencyTextField
                                            suffix=" cm"
                                            precision="1"
                                            className={classes.currencyinput}
                                            label="Comprimento"
                                            thousandSeparator="."
                                            decimalSeparator="."
                                            onChange={({ floatValue }) => form.setFieldValue('length', floatValue)}
                                            value={field.value}
                                          />
                                        )}
                                      </Field>
                                    </Grid>
                                    <Grid item xs={12} lg={6} md={6}>
                                      <Field name="width">
                                        {({ field, form }: FieldProps) => (
                                          <CurrencyTextField
                                            suffix=" cm"
                                            precision="1"
                                            className={classes.currencyinput}
                                            label="Largura"
                                            thousandSeparator="."
                                            decimalSeparator="."
                                            onChange={({ floatValue }) => form.setFieldValue('width', floatValue)}
                                            value={field.value}
                                          />
                                        )}
                                      </Field>
                                    </Grid>
                                    <Grid item xs={12} lg={6} md={6}>
                                      <Field name="height">
                                        {({ field, form }: FieldProps) => (
                                          <CurrencyTextField
                                            suffix=" cm"
                                            precision="1"
                                            className={classes.currencyinput}
                                            label="Altura"
                                            thousandSeparator="."
                                            decimalSeparator="."
                                            onChange={({ floatValue }) => form.setFieldValue('height', floatValue)}
                                            value={field.value}
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
                                <Typography className={classes.title}>
                                  Pré-visualização da listagem de mecanismo de pesquisa
                                </Typography>
                                <Typography className={classes.caption}>
                                  Adicione um título e uma descrição para visualizar como produto pode aparecer em uma listagem de
                                  mecanismo de pesquisa
                                </Typography>
                                <Divider className={classes.divider} />
                                <section className={classes.section}>
                                  <Field name="metaTitle">
                                    {({ field }: FieldProps) => (
                                      <TextField
                                        classes={{
                                          root: classes.textfield,
                                        }}
                                        fullWidth
                                        helperText={`${field.value?.length} de 70 caracteres usados`}
                                        variant="outlined"
                                        inputProps={{
                                          maxLength: 70,
                                        }}
                                        label="Título da página"
                                        {...field}
                                        autoComplete="off"
                                      />
                                    )}
                                  </Field>
                                </section>
                                <section className={classes.section}>
                                  <Field name="metaDescription">
                                    {({ field }: FieldProps) => (
                                      <TextField
                                        multiline
                                        rows={3}
                                        classes={{
                                          root: classes.textarea,
                                        }}
                                        fullWidth
                                        helperText={`${field.value ? field.value.length : 0} de 160 caracteres usados`}
                                        variant="outlined"
                                        inputProps={{
                                          maxLength: 160,
                                        }}
                                        label="Descrição"
                                        {...field}
                                        autoComplete="off"
                                      />
                                    )}
                                  </Field>
                                </section>
                                <section className={classes.section}>
                                  <Field name="url" style={{ width: '100%' }}>
                                    {({ form }: FieldProps) => (
                                      <TextField
                                        fullWidth
                                        classes={{
                                          root: classes.textfield,
                                        }}
                                        variant="outlined"
                                        label="URL"
                                        disabled
                                        value={`${store?.url}produtos/${
                                          form.values.slug.length > 0 ? form.values.slug[form.values.slug.length - 1] : ''
                                        }`}
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
                            {
                              // <ProductInsight product={product} mode={mode} classes={classes} />
                            }

                            {/* Product Organization */}

                            <div>
                              <PaperBlock>
                                <Typography className={classes.title}>Organização</Typography>

                                <section className={classes.section}>
                                  <Box mb={1}>
                                    <Field name="manufacturer">
                                      {({ field, form }: FieldProps) => (
                                        <Autocomplete
                                          options={manufacturers}
                                          value={field.value}
                                          renderInput={(params: AutocompleteRenderInputParams) => (
                                            <TextField
                                              {...params}
                                              variant="outlined"
                                              label="Fabricante"
                                              placeholder="Procure o fabricante"
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
                                          getOptionLabel={(op: Manufacturer) => op.name}
                                          onChange={(ev: any, manufacturer: Manufacturer | null) => {
                                            if (manufacturer) {
                                              form.setFieldValue('manufacturer', manufacturer)
                                            }
                                          }}
                                          className={classes.autocomplete}
                                          onInputChange={(e: React.ChangeEvent<{}>, value: string) => {
                                            getManufacturers({
                                              name: value,
                                            })
                                          }}
                                        />
                                      )}
                                    </Field>
                                  </Box>
                                  <Field name="manufacturer">
                                    {({ field, form }: FieldProps) =>
                                      field.value ? (
                                        <Grid container>
                                          <Box ml={1} mt={1}>
                                            <Chip
                                              label={
                                                field.value.name ||
                                                manufacturers.find((manufacturer) => manufacturer._id === field.value)?.name
                                              }
                                              onDelete={() => form.setFieldValue('manufacturer', null)}
                                            />
                                          </Box>
                                        </Grid>
                                      ) : (
                                        <div />
                                      )
                                    }
                                  </Field>
                                </section>
                                <section className={classes.section}>
                                  <Box mb={1}>
                                    <FieldArray
                                      name="category"
                                      render={({ form, push }: FieldArrayRenderProps) => (
                                        <Autocomplete
                                          value={form.values.category}
                                          options={categorys}
                                          renderInput={(params: AutocompleteRenderInputParams) => (
                                            <TextField
                                              {...params}
                                              variant="outlined"
                                              label="Categoria"
                                              placeholder="Procure a categoria"
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
                                          getOptionDisabled={(option: Category) =>
                                            form.values.category.find((category: Category) => category._id === option._id)
                                              ? true
                                              : false
                                          }
                                          getOptionLabel={(op: Category) => op.name}
                                          onChange={(ev: any, category: Category | null) => {
                                            if (category) {
                                              push(category)
                                            }
                                          }}
                                          className={classes.autocomplete}
                                          onInputChange={(e: React.ChangeEvent<{}>, value: string) => {
                                            getCategorys({ name: value })
                                          }}
                                        />
                                      )}
                                    />
                                  </Box>
                                  <FieldArray
                                    name="category"
                                    render={({ form, remove }: FieldArrayRenderProps) => (
                                      <Grid container>
                                        {form.values.category.map((category: Category, index: number) => (
                                          <Box ml={index !== 0 ? 1 : 0} mt={1} key={index}>
                                            <Chip label={category.name} onDelete={() => remove(index)} />
                                          </Box>
                                        ))}
                                      </Grid>
                                    )}
                                  />
                                </section>
                                <Field
                                  name="priceLocked"
                                  label="Travar PREÇO perante integração"
                                  labelPlacement="start"
                                  component={SwitchFormField}
                                />
                                <Field
                                  name="quantityLocked"
                                  label="Travar QUANTIDADE perante integração"
                                  labelPlacement="start"
                                  component={SwitchFormField}
                                />
                                <Tooltip title="Se ativo sera mostrado o valor aqui definido">
                                  <Field
                                    name="manualPMC"
                                    label="Definir PMC manualmente ?"
                                    labelPlacement="start"
                                    component={SwitchFormField}
                                  />
                                </Tooltip>
                              </PaperBlock>
                            </div>
                          </Grid>
                        </Grid>
                      </React.Fragment>
                    )}
                  </ManufacturerConsumer>
                )}
              </ProductControlConsumer>
            )}
          </CategoryConsumer>
        )}
      </ClassificationConsumer>
    )
  }
}

export default withStyles(style)(ProductForm)
