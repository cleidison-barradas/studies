import { Button, CircularProgress, Grid, Typography, withStyles } from '@material-ui/core'
import { Form, Formik } from 'formik'
import React, { Component } from 'react'
import Product from '../../../interfaces/product'
import ProductSearchDialog from '../../Dialogs/ProductSearchDialog'
import styles from './styles'
import { Link } from 'react-router-dom'
import { ReactComponent as GoBackArrow } from '../../../assets/images/icons/blueBackArrow.svg'
import Store from '../../../interfaces/store'
import ProductForm from '../../Forms/ProductForm'
import { isEqual } from 'lodash'
import * as yup from 'yup'
import ImportData from '../../../interfaces/importData'

interface LocationProps {
  product: ImportData | null
}

interface Props {
  mode: any
  store?: Store
  success: boolean
  products: Product[]
  product: Product | null
  importValue: LocationProps
  loadControls: (data?: any) => void
  loadCategories: (data?: any) => void
  loadProductDetail: (data?: any) => void
  onSave: (data: Product) => Promise<void>
  loadManufacturers: (data?: any) => void
  loadClassifications: (data?: any) => void
  openSnackbar: (message: string, severity?: 'error' | 'info' | 'success' | 'warning') => void
  getProducts: (...args: any) => Promise<void>
  classes: Record<keyof ReturnType<typeof styles>, string>
}

interface State {
  searchModal: boolean
}

class NewProductPaper extends Component<Props, State> {
  static defaultProps = {
    store: undefined,
    products: [],
    product: null,
    success: false,
  }
  state: State = {
    searchModal: true,
  }

  componentDidMount() {
    const { loadControls, loadCategories, loadClassifications, loadManufacturers, getProducts } = this.props
    getProducts({ EAN: 'unknown' })
    loadControls()
    loadCategories()
    loadManufacturers()
    loadClassifications()
  }

  handleModal = () => {
    this.setState({
      ...this.state,
      searchModal: !this.state.searchModal,
    })
  }

  save = async (data: Product) => {
    const { onSave, success, openSnackbar } = this.props
    await onSave(data)
    if (success) {
      openSnackbar('Produto criado com sucesso')
    } else {
      openSnackbar('Falha ao criar produto')
    }
  }

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

  render() {
    const { products, getProducts, classes, mode, store, product, importValue } = this.props
    const { searchModal } = this.state

    return (
      <React.Fragment>
        <Formik
          initialValues={{
            MS: '',
            EAN: importValue && importValue.product ? importValue.product.EAN : '',
            name: importValue && importValue.product ? importValue.product.name : '',
            slug: [],
            price: importValue && importValue.product ? Number(importValue.product.price) : 0,
            model: '',
            pmcPrice: 0,
            quantity: importValue && importValue.product ? Number(importValue.product.quantity) : 0,
            category: [],
            status: true,
            specials: [],
            metaTitle: '',
            description: '',
            manualPMC: false,
            presentation: importValue && importValue.product ? importValue.product.presentation : '',
            image: undefined,
            control: undefined,
            activePrinciple: '',
            metaDescription: '',
            manufacturer: undefined,
            classification: undefined,
            width: 0,
            weight: 0,
            length: 0,
            height: 0,
            product,
          }}
          onSubmit={this.save}
          validationSchema={this.validationSchema}
          enableReinitialize
        >
          {({ isSubmitting, setValues, values, initialValues }) => (
            <Form>
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
                    disabled={isSubmitting || isEqual(initialValues, values)}
                  >
                    {isSubmitting ? <CircularProgress size={20} /> : 'Salvar'}
                  </Button>
                </Grid>
              </Grid>
              <ProductForm store={store} mode={mode} />
              <ProductSearchDialog
                open={searchModal}
                handleClose={this.handleModal}
                products={products}
                getProducts={getProducts}
                fetching={isSubmitting}
                handleSubmit={(data: Product) => {
                  setValues({
                    ...values,
                    ...data,
                  })
                  this.handleModal()
                }}
              />
              <Grid container={window.innerWidth < 1200} alignItems="center" justify="space-between" md={12}>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={isSubmitting || isEqual(initialValues, values)}
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
