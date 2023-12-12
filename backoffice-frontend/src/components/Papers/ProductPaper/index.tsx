import { Button, CircularProgress, Grid, LinearProgress, Typography, withStyles } from '@material-ui/core'
import { Form, Formik } from 'formik'
import React, { Component } from 'react'
import Product from '../../../interfaces/product'
import styles from './styles'
import { Link, RouteComponentProps } from 'react-router-dom'
import { ReactComponent as GoBackArrow } from '../../../assets/images/icons/blueBackArrow.svg'
import Category from '../../../interfaces/category'
import Classification from '../../../interfaces/classification'
import Manufacturer from '../../../interfaces/manufacturer'
import Control from '../../../interfaces/control'
import Store from '../../../interfaces/store'
import ProductForm from '../../Forms/ProductForm'
import * as yup from 'yup'
import { isEqual } from 'lodash'
import { GetProductRequest, PostProductRequest } from '../../../services/api/interfaces/ApiRequest'

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
  fetching?: boolean
  product: Product | null
  categories: Category[]
  manufacturers: Manufacturer[]
  classifications: Classification[]
  controls: Control[]
  store?: Store
  _id?: string
  getManufacturer: (data?: any) => void
  getClassification: (data?: any) => void
  getControl: (data?: any) => void
  getCategory: (data?: any) => void
  save: (data: Product) => Promise<void>
  getProduct: (data: GetProductRequest) => Promise<void>
  createProduct: (data: PostProductRequest) => Promise<void>
  updateProduct: (data: PostProductRequest) => Promise<void>
  getProductDetail: (id: string) => Promise<void>
  history: RouteComponentProps['history']
}

interface State {
  product: Product
}

class NewProductPaper extends Component<Props, State> {
  state: State = {
    product: {
      EAN: '',
      description: '',
      name: '',
      quantity: 0,
      status: true,
      metaTitle: '',
      metaDescription: '',
    },
  }

  initialValues: GetProductRequest = {
    limit: 10,
    page: 1,
  }

  async componentDidMount() {
    const { getControl, getCategory, getClassification, getManufacturer, _id, getProductDetail } = this.props
    getControl()
    getCategory()
    getManufacturer({})
    getClassification()
    if (_id && getProductDetail) {
      await getProductDetail(_id)
    }
  }

  save = async (product: Product) => {
    const { createProduct, history, _id, updateProduct, getProduct } = this.props
    if (_id) {
      await updateProduct({ product })
      getProduct(this.initialValues)
    } else {
      await createProduct({ product })
      getProduct(this.initialValues)
    }
    history.replace('/products')
  }

  validationSchema = yup.object({
    EAN: yup.string().required(),
    description: yup.string(),
    name: yup.string().required(),
    quantity: yup.number(),
    status: yup.bool(),
    MS: yup.string(),
    activePrinciple: yup.string(),
    price: yup.number(),
    _id: yup.string(),
  })

  render() {
    const { classes, categories, manufacturers, classifications, store, controls, fetching, product } = this.props

    return (
      <React.Fragment>
        <Formik
          initialValues={product || this.state.product}
          enableReinitialize
          onSubmit={this.save}
          validationSchema={this.validationSchema}
        >
          {({ isSubmitting, values, isValid, initialValues }) => (
            <Form>
              {fetching && <LinearProgress />}
              <Grid container alignItems="center" justify="space-between" className={classes.header}>
                <Grid item className={classes.headergrid1} xs={12} md={12} lg={6}>
                  <Grid container alignItems="center" spacing={2}>
                    <Link to="/products" className={classes.goback}>
                      <GoBackArrow />
                    </Link>
                    <Typography className={classes.gobacktext}>Adicionar produto</Typography>
                  </Grid>
                </Grid>
                <Grid container={window.innerWidth < 1200} alignItems="center" justify="space-between">
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    disabled={isSubmitting || !isValid || isEqual(initialValues, values)}
                  >
                    {isSubmitting ? <CircularProgress size={20} /> : 'Salvar'}
                  </Button>
                </Grid>
              </Grid>
              <ProductForm
                categorySearch={() => Function}
                categories={categories}
                manufacturers={manufacturers}
                controls={controls}
                classifications={classifications}
                store={store}
              />
              <Grid container={window.innerWidth < 1200} alignItems="center" justify="space-between" md={12}>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={isSubmitting || !isValid || isEqual(initialValues, values)}
                >
                  {isSubmitting ? <CircularProgress size={20} /> : 'Salvar'}
                </Button>
              </Grid>
            </Form>
          )}
        </Formik>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(NewProductPaper)
