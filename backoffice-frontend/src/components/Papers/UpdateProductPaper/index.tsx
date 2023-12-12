import React, { Component } from 'react'
import { Form, Formik } from 'formik'
import { Box, Button, CircularProgress, Grid, Typography, withStyles } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { isEqual } from 'lodash'
import * as yup from 'yup'
import styles from './styles'

import ProductForm from '../../Forms/ProductForm'

import Product from '../../../interfaces/product'
import Control from '../../../interfaces/control'
import Category from '../../../interfaces/category'
import Manufacturer from '../../../interfaces/manufacturer'
import Classification from '../../../interfaces/classification'
import { GetCategoryRequest, PostProductRequest } from '../../../services/api/interfaces/ApiRequest'

import { ReactComponent as GoBackArrow } from '../../../assets/images/icons/blueBackArrow.svg'

interface Props {
  productId: string
  fetching: boolean
  controls: Control[]
  product: Product | null
  categories: Category[]
  manufacturers: Manufacturer[]
  classifications: Classification[]
  loadControl: () => void
  onUpdate: (data: PostProductRequest) => Promise<void>
  loadClassification: () => void
  loadProduct: (id: string) => void
  loadCategory: (data?: GetCategoryRequest) => void
  loadManufacturer: (data: Record<any, any>) => void
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class UpdateProductPaper extends Component<Props> {
  static defaulProps = {
    fetching: false,
  }

  schemaValidate = yup.object().shape({
    EAN: yup.string().required('EAN do produto é obrigatório'),
    name: yup.string().required('Nome do produto é obrigatório'),
    metaTitle: yup
      .string()
      .required('Meta titúlo do produto é obrigatório')
      .max(70, 'máximo de caracteres permitidos 70'),
  })

  componentDidMount() {
    const { loadCategory, loadControl, loadManufacturer, loadClassification } = this.props
    this.onLoad()
    loadControl()
    loadCategory()
    loadManufacturer({})
    loadClassification()
  }

  onLoad = () => {
    const { loadProduct, productId } = this.props

    if (productId) {
      loadProduct(productId)
    }
  }

  handleSubmit = async (product: Partial<Product>) => {
    const { productId, onUpdate } = this.props

    if (productId) {
      await onUpdate({ _id: productId, product })
    }

    this.onLoad()
  }

  render() {
    const { classes, controls, product, categories, manufacturers, classifications, loadCategory } = this.props

    return (
      <Formik
        initialValues={{ ...product }}
        onSubmit={this.handleSubmit}
        enableReinitialize
        validationSchema={this.schemaValidate}
      >
        {({ isSubmitting, initialValues, values }) => (
          <Form>
            <Grid container>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" mt={2} mb={2}>
                  <Box display="flex" alignItems="center">
                    <Link to="/products" className={classes.goback}>
                      <GoBackArrow />
                    </Link>
                    <Typography className={classes.gobacktext}>Editar produto</Typography>
                  </Box>

                  <Button type="submit" color="primary" variant="contained" disabled={isEqual(initialValues, values)}>
                    {isSubmitting ? <CircularProgress size={20} /> : 'Salvar'}
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <ProductForm
                  controls={controls}
                  categories={categories}
                  manufacturers={manufacturers}
                  classifications={classifications}
                  categorySearch={loadCategory}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Button type="submit" color="primary" variant="contained" disabled={isEqual(initialValues, values)}>
                  {isSubmitting ? <CircularProgress size={20} /> : 'Salvar'}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    )
  }
}

export default withStyles(styles)(UpdateProductPaper)
