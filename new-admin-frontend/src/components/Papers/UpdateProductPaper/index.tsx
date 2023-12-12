import { Button, CircularProgress, Grid, LinearProgress, Typography, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import Product from '../../../interfaces/product'

import Store from '../../../interfaces/store'
import styles from './styles'
import * as yup from 'yup'
import { isEqual } from 'lodash'
import { Formik, Form } from 'formik'
import ProductForm from '../../Forms/ProductForm'
import { Link } from 'react-router-dom'
import { ReactComponent as GoBackArrow } from '../../../assets/images/icons/blueBackArrow.svg'

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
  onSave: (data: Product) => Promise<void>
  id: Product['_id']
  product?: any
  products: Product[]
  mode: any
  loadControls: (data?: any) => void
  loadCategories: (data?: any) => void
  store?: Store
  loadProductDetail: (data?: any) => void
  loadManufacturers: (data?: any) => void
  loadClassifications: (data?: any) => void
  getProduct: (_id: any) => Promise<void>
  openSnackbar: (message: string, severity?: 'error' | 'info' | 'success' | 'warning') => void
  fetching: any
  success: any
}

class UpdateProductPaper extends Component<Props> {
  async componentDidMount() {
    const { id, getProduct, loadControls, loadCategories, loadClassifications, loadManufacturers } = this.props
    loadControls()
    loadCategories()
    loadManufacturers()
    loadClassifications()
    await getProduct(id)
  }

  save = async (data: Product) => {
    const { onSave, success, openSnackbar } = this.props
    await onSave(data)
    if (success) {
      openSnackbar('Produto atualizado com sucesso')
    } else {
      openSnackbar('Falha ao criar produto')
    }
  }

  validationSchema = yup.object({
    _id: yup.string(),
    status: yup.bool(),
    quantity: yup.number(),
    manualPMC: yup.boolean(),
    description: yup.string(),
    presentation: yup.string(),
    MS: yup.string().nullable(),
    EAN: yup.string().required('EAN é obrigatório'),
    name: yup.string().required('Name é obrigatório'),
    price: yup.number().min(0.05, 'Valor mínimo é de R$ 0,5'),
    pmcPrice: yup.number(),
  })

  render() {
    const {
      fetching,
      mode,
      store,
      classes,
      product = {
        EAN: '',
        name: '',
        model: '',
        slug: [],
        quantity: 0,
        status: true,
        metaTitle: '',
        metaDescription: '',
        MS: null,
        presentation: '',
        activePrinciple: '',
        specials: [],
        manualPMC: false,
        pmcPrice: 0,
        category: [],
        priceLocked: false,
        quantityLocked: false,
      },
    } = this.props

    return (
      <Formik
        initialValues={{
          ...product,
          control: product.control?._id || 0,
          classification: product.classification?._id || 0,
        }}
        onSubmit={this.save}
        enableReinitialize
        validationSchema={this.validationSchema}
      >
        {({ isSubmitting, values, initialValues }) => (
          <Form>
            {fetching && <LinearProgress />}
            <Grid container alignItems="center" justify="space-between" className={classes.header}>
              <Grid item className={classes.headergrid1} xs={12} md={12} lg={6}>
                <Grid container alignItems="center" spacing={2}>
                  <Link to="/products" className={classes.goback}>
                    <GoBackArrow />
                  </Link>
                  <Typography className={classes.gobacktext}>Atualizar produto</Typography>
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
            {product && <ProductForm store={store} mode={mode} />}
            <Grid container={window.innerWidth < 1200} alignItems="center" justify="space-between" md={12}>
              <Button type="submit" color="primary" variant="contained" disabled={isSubmitting || isEqual(initialValues, values)}>
                {isSubmitting ? <CircularProgress size={20} /> : 'Salvar'}
              </Button>
            </Grid>
          </Form>
        )}
      </Formik>
    )
  }
}

export default withStyles(styles)(UpdateProductPaper)
