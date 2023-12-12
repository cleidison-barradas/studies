import React, { Component } from 'react'
import { Box, Button, CircularProgress, Grid, IconButton, Typography, withStyles } from '@material-ui/core'
import { RouterProps } from 'react-router-dom'
import CategoryForm from '../../Forms/CategoryForm'
import { Form, Formik } from 'formik'
import * as yup from 'yup'
// Interfaces
import Category from '../../../interfaces/category'

import styles from './styles'
import { ReactComponent as GoBackIcon } from '../../../assets/images/goBack.svg'

interface Props extends RouterProps {
  mode: any
  fetching: boolean
  onSuccess: boolean
  categories: Category[]
  category: Category | null
  onSave: (data: any) => void
  loadCategories: (data?: any) => void
  openSnackbar: (message: string, severity?: 'error' | 'info' | 'success' | 'warning') => void
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class NewCategoryPaper extends Component<Props> {
  static defaultProps = {
    onSuccess: false,
    fetching: false,
    categories: [],
    category: null,
  }

  componentDidMount() {
    const { loadCategories } = this.props
    loadCategories()
  }

  handleSave = (data: any) => {
    const { onSave, openSnackbar, onSuccess } = this.props
    onSave({
      ...data,
      image: data.image ? data.image.content : undefined,
    })
    if (onSuccess) {
      openSnackbar('Categoria criado com successo !')
    } else {
      openSnackbar('Ocorreu um erro tente novamente mais tarde !')
    }
  }

  schemaValidation = yup.object().shape({
    name: yup.string().required('Nome é obrigátorio!.'),
    status: yup.boolean(),
    metaTitle: yup.string().required('Título é obrigatório!').max(70, 'máximo de caracteres 70'),
    metaDescription: yup.string().required('Meta Description é obrigatório!').max(150, 'maximo de caracteres 150'),
    subCategories: yup.array(),
  })

  render() {
    const { mode, classes, history, categories, category, fetching, loadCategories } = this.props

    return (
      <Formik
        initialValues={{
          name: '',
          parentId:'0',
          status: 'true',
          metaTitle: '',
          metaDescription: '',
          subCategories: [],
          type:"mainCategory",
          category,
        }}
        enableReinitialize
        onSubmit={this.handleSave}
        validationSchema={this.schemaValidation}
      >
        {({ isValid, values, setFieldValue}) => (
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
                      <Typography className={classes.headertxt}>Nova Categoria</Typography>
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
                      <Button color="primary" variant="contained" type="submit" disabled={!isValid}>
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
                  <Button color="primary" variant="contained" type="submit" disabled={!isValid}>
                    {fetching ? <CircularProgress size={20} color="secondary" /> : 'SALVAR'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Form>
        )}
      </Formik>
    )
  }
}

export default withStyles(styles)(NewCategoryPaper)
