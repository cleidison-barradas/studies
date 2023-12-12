import React, { Component } from 'react'
import { Grid, withStyles, TextField, Chip, Box, Button, Divider, CircularProgress, Checkbox } from '@material-ui/core'
import { Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab'
import * as yup from 'yup'
import { Formik, Field, FieldArray, FieldArrayRenderProps, FieldProps } from 'formik'

import { EditorState, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { isEqual } from 'lodash'

import style from './style'

import Store from '../../interfaces/store'
import Product from '../../interfaces/product'
import Category from '../../interfaces/category'

import { CategoryConsumer } from '../../context/CategoryContext'
import DocasProductImage from '../Forms/DocasProductImage'

type Props = {
  classes: any
  mode: any
  store?: Store
  products: Product[]
  onSave: (data: Product) => Promise<void>
  success: any
  openSnackbar: (message: string, severity?: 'error' | 'info' | 'success' | 'warning') => void
}


class DocasIncompleteProductForm extends Component<Props> {
  validationSchema = yup.object({
    EAN: yup.string().required('EAN é obrigatório'),
    description: yup.string(),
    name: yup.string().required('Name é obrigatório'),
    quantity: yup.number().required('Estoque é obrigatório'),
    status: yup.bool().required('Status é obrigatório'),
    manualPMC: yup.boolean(),
    MS: yup.string().nullable(),
    pmcPrice: yup.number(),
    price: yup.number().required().min(0.05, 'Valor mínimo é de R$ 0,05'),
    _id: yup.string(),
    width: yup.number(),
    weight: yup.number(),
    length: yup.number(),
    height: yup.number(),
  })

  state = {
    descriptionEditorStates: Array<EditorState>(),
    isCategoriesAutocompleteOpen: false,
    descriptionEditorFocused: null,
  }

  handleAutocompleteOpen = () => {
    this.setState({ isCategoriesAutocompleteOpen: true })
  }

  handleAutocompleteClose = () => {
    this.setState({ isCategoriesAutocompleteOpen: false })
  }

  componentDidMount() {
    this.initializeDescriptionEditorStates()
  }

  initializeDescriptionEditorStates() {
    const { products } = this.props
    const descriptionEditorStates = products.map((product) => {
      const contentState = ContentState.createFromText(product.description || '')
      return EditorState.createWithContent(contentState)
    })

    this.setState({ descriptionEditorStates })
  }

  save = async (data: Product) => {
    const { onSave } = this.props
    await onSave(data)
  }

  render() {
    const { mode, classes, products, onSave } = this.props
    const { descriptionEditorStates, isCategoriesAutocompleteOpen } = this.state

    return (
      <React.Fragment>
        <div className={classes.rootDiv}>
          {products.map((product, index) => (
            <div key={product._id} className={classes.rootDiv}>
              <Formik
                initialValues={{ ...product }}
                onSubmit={this.save}
                validationSchema={this.validationSchema}
                enableReinitialize
              >
                {({ values, handleChange, isSubmitting, initialValues }) => (
                  <form>
                    {/* First Column: "Imagem" */}
                    <Grid container spacing={1} alignItems="flex-start">
                      <Grid item xs={12} lg={3} md={3}>
                        <DocasProductImage mode={mode} classes={classes} />
                      </Grid>

                      {/* Second Column */}
                      <Grid item xs={12} lg={9} md={9}>
                        {/* Rest of the form fields */}
                        {/* First Line: Nome, Categoria */}
                        <Grid container spacing={3}>
                          <Grid item xs={6} lg={6} md={4}>
                            <TextField
                              className={classes.textfield}
                              label="Nome"
                              name="name"
                              autoComplete="off"
                              value={values.name}
                              onChange={handleChange}
                              variant="outlined"
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={6} lg={6} md={4}>
                            <TextField
                              fullWidth
                              classes={{
                                root: classes.textfield,
                              }}
                              label="Apresentação"
                              name="presentation"
                              autoComplete="off"
                              variant="outlined"
                              error={!values.presentation}
                              value={values.presentation}
                              onChange={handleChange}
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} lg={12} md={12}>
                          <CategoryConsumer>
                            {({ categorys, getCategorys }) => (
                              <section className={classes.section}>
                                <Box mb={1}>
                                  <FieldArray
                                    name="category"
                                    render={({ form, remove }: FieldArrayRenderProps) => {
                                      const selectedCategories = form.values.category

                                      return (
                                        <div>
                                          <Autocomplete
                                            onOpen={this.handleAutocompleteOpen}
                                            onClose={this.handleAutocompleteClose}
                                            multiple
                                            value={selectedCategories}
                                            options={categorys}
                                            renderTags={() => null}
                                            renderOption={(op, { selected }) => (
                                              <React.Fragment>
                                                <Checkbox style={{ marginRight: 8 }} checked={selected} />
                                                {op.name}
                                              </React.Fragment>
                                            )}
                                            renderInput={(params: AutocompleteRenderInputParams) => {
                                              const displayText =
                                                selectedCategories.length === 1
                                                  ? selectedCategories[0].name
                                                  : `${selectedCategories.length} selected...`

                                              const placeholderText = isCategoriesAutocompleteOpen
                                                ? 'Pesquise pelo nome da categoria'
                                                : 'Selecione as categorias para este produto'

                                              return (
                                                <TextField
                                                  {...params}
                                                  variant="outlined"
                                                  placeholder={placeholderText}
                                                  className={classes.categoryField}
                                                  error={!values.category || values.category.length === 0}
                                                  InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                      <React.Fragment>{params.InputProps.endAdornment}</React.Fragment>
                                                    ),
                                                  }}
                                                  value={displayText}
                                                />
                                              )
                                            }}
                                            getOptionLabel={(op: Category) => op.name}
                                            onChange={(ev: any, categories: Category[] | null) => {
                                              form.setFieldValue('category', categories)
                                            }}
                                            className={classes.autocomplete}
                                            onInputChange={(e: React.ChangeEvent<{}>, value: string) => {
                                              getCategorys({ name: value })
                                            }}
                                          />
                                          <div className={classes.chipsContainer}>
                                            {selectedCategories.map((category: Category, index: number) => (
                                              <Chip
                                                key={category._id}
                                                label={category.name}
                                                className={classes.categoryChip}
                                                onDelete={() => {
                                                  remove(index)
                                                }}
                                              />
                                            ))}
                                          </div>
                                        </div>
                                      )
                                    }}
                                  />
                                </Box>
                              </section>
                            )}
                          </CategoryConsumer>
                        </Grid>

                        <Grid item xs={12} lg={12} md={6}>
                          <Field name="description">
                            {({ field, form }: FieldProps) => {
                              const isEmpty = !field.value || field.value.trim() === ''
                              const isFocused = this.state.descriptionEditorFocused === index
                              const borderWidth = isFocused ? '2px ' : '1px '
                              const borderStyle = isEmpty ? 'solid red' : (isFocused ? 'solid #2480FF' : 'solid #929699')
                              const borderRadius = '5px'
                              return (
                                <div
                                  style={{
                                    border: borderStyle,
                                    backgroundColor: 'white',
                                    borderRadius,
                                    borderWidth,
                                    position: 'relative',
                                    marginTop: '20px',
                                    cursor: 'text',
                                  }}
                                  onMouseEnter={() => {this.setState({ descriptionEditorFocused: index })}}
                                  onMouseLeave={() => {this.setState({ descriptionEditorFocused: null })}}
                                >
                                  <div
                                    style={{
                                      borderRadius: '25%',
                                      position: 'absolute',
                                      top: '-15px',
                                      left: '10px',
                                      backgroundColor: 'white',
                                      padding: '0 5px',
                                      color: '#7A828A',
                                      fontSize: '12px',
                                    }}
                                  >
                                    Descrição
                                  </div>
                                  <div style={{ marginLeft: '10px', height: '192px', overflow: 'auto' }}>
                                    <Editor
                                      editorState={descriptionEditorStates[index]}
                                      wrapperClassName="description-wrapper"
                                      editorClassName="description-editor"
                                      onEditorStateChange={(editorState) => {
                                        const newEditorStates = [...descriptionEditorStates]
                                        newEditorStates[index] = editorState
                                        this.setState({ descriptionEditorStates: newEditorStates })

                                        const plainText = editorState.getCurrentContent().getPlainText()
                                        form.setFieldValue('description', plainText)
                                      }}
                                    />
                                  </div>
                                </div>
                              )
                            }}
                          </Field>
                        </Grid>
                        <Grid item xs={12} lg={12} md={4}>
                          <Button
                            variant="contained"
                            color="primary"
                            className={classes.saveButton}
                            disabled={isSubmitting || isEqual(initialValues, values)}
                            onClick={() => onSave(values)}
                          >
                            {isSubmitting ? <CircularProgress size={20} /> : 'Salvar'}
                          </Button>
                        </Grid>
                      </Grid>
                      {index !== products.length - 1 && (
                        <Grid item xs={12} lg={12} md={4}>
                          <Divider variant="fullWidth" className={classes.dividerLine} />
                        </Grid>
                      )}
                    </Grid>
                  </form>
                )}
              </Formik>
            </div>
          ))}
        </div>
      </React.Fragment>
    )
  }
}

export default withStyles(style)(DocasIncompleteProductForm)
