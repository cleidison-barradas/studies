import { Form, Formik } from 'formik'
import React, { Component } from 'react'
import Category from '../../../interfaces/category'
import CategoryForm from '../../Forms/CategoryForm'
import * as yup from 'yup'
import { RouterProps } from 'react-router-dom'
import { Box, Button, CircularProgress, Grid, IconButton, Typography, withStyles } from '@material-ui/core'
import { ReactComponent as GoBackIcon } from '../../../assets/images/goBack.svg'
import styles from './styles'
import { isEqual } from 'lodash'

interface Props extends RouterProps {
  mode: any
  fetching: boolean
  onSuccess: boolean
  categoryId: string
  categories: Category[]
  category: Category | null
  loadCategory: (data: any) => void
  loadCategories: (data?: any) => void
  onEdit: (id: string, data: any) => void
  openSnackbar: (message: string, severity?: 'error' | 'info' | 'success' | 'warning') => void
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class EditCategoryPaper extends Component<Props> {
  static defaultProps = {
    fetching: false,
    onSuccess: false,
    categoryId: '',
    categories: [],
    category: null,
  }

  componentDidMount() {
    const { loadCategories, loadCategory, categoryId } = this.props
    loadCategories()
    if (categoryId) {
      loadCategory(categoryId)
    }
  }

  handleEdit = (data: any) => {
    const { onEdit, categoryId, onSuccess, openSnackbar } = this.props
    onEdit(categoryId, data)

    if (onSuccess) {
      openSnackbar('Categoria alterada com sucesso!')
    } else {
      openSnackbar('Ocorreu um erro tente novamente mais tarde!')
    }
  }

  schemaValidation = yup.object().shape({
    name: yup.string().required('Nome é obrigatório!'),
    metaTitle: yup.string().required('Título é obrigatório!'),
    metaDescription: yup.string().required('Meta Description é obrigatório!'),
  })
  render() {
    const { mode, classes, fetching, history, category, loadCategories, categories } = this.props
    const CategoriesArray: Category[] = []

    return (
      <Formik
        initialValues={
          category ?
          { ...category,
            type: category.parentId === "0" ? "mainCategory" : "subCategory",
            status: category.status.toString()
          }
          :
          { name: '',
            metaTitle: '',
            subCategories: CategoriesArray,
            parentId:'0',
            type: 'mainCategory',
            image: null,
            status: 'true'
           }
        }
        onSubmit={this.handleEdit}
        enableReinitialize
        validationSchema={this.schemaValidation}
      >
        {({ values, isValid, initialValues, setFieldValue }) => (
          <Form>
            <Form>
              <Box mt={2} mb={3}>
                <Grid container alignItems="center" justify="space-between">
                  <Grid item>
                    <Grid container spacing={2}>
                      <Grid item>
                        <IconButton
                          classes={{
                            root: classes.iconbtn,
                          }}
                          onClick={() => history.goBack()}
                        >
                          <GoBackIcon />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <Typography className={classes.headertxt}>Editar Categoria</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Grid container spacing={2}>
                      <Grid item>
                        <Button
                          color="default"
                          onClick={() => history.push('/categories')}
                          classes={{
                            root: classes.discardbtn,
                          }}
                        >
                          descartar
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          color="primary"
                          variant="contained"
                          type="submit"
                          disabled={!isValid || isEqual(initialValues, values)}
                        >
                          {fetching ? <CircularProgress size={20} color="secondary" /> : 'SALVAR'}
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
              <Grid container spacing={3}>
                <CategoryForm
                  mode={mode}
                  values={values}
                  setFieldValue= {setFieldValue}
                  fetching={fetching}
                  history={history}
                  categories={categories}
                  loadCategories={loadCategories}
                />
              </Grid>
              <Box>
                <Grid container spacing={2}>
                  <Grid item>
                    <Button
                      onClick={() => history.push('/categories')}
                      classes={{
                        root: classes.discardbtn,
                      }}
                    >
                      Descartar
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      color="primary"
                      variant="contained"
                      type="submit"
                      disabled={!isValid || isEqual(initialValues, values)}
                    >
                      {fetching ? <CircularProgress size={20} color="secondary" /> : 'SALVAR'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Form>
          </Form>
        )}
      </Formik>
    )
  }
}

export default withStyles(styles)(EditCategoryPaper)
