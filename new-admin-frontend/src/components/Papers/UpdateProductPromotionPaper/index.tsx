import { Button, Grid } from '@material-ui/core'
import { Form, Formik } from 'formik'
import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router'
import Category from '../../../interfaces/category'
import Classification from '../../../interfaces/classification'
import Product from '../../../interfaces/product'
import PromotionForm from '../../Forms/PromotionForm'
import PaperBlock from '../../PaperBlock'
import * as yup from 'yup'
import SuportLink from '../../SuportLink'

interface Props extends RouteComponentProps {
  mode: any
  classes: any
  success: boolean
  fetching: boolean
  promotionId: string
  promotion?: Product
  product?: Product | null
  products: Product[]
  onEdit: (data: any) => Promise<void>
  loadProducts: (data?: any) => void
  loadPromotion: (id: string) => void
  loadCategories: (data?: any) => void
  loadClassifications: (data?: any) => void
  classifications: Classification[]
  categories: Category[]
}

class UpdateProductPromotionPaper extends Component<Props> {
  static defaultProps = {
    products: [],
    success: false,
    fetching: false,
    promotionId: '',
    promotion: undefined,
  }
  async componentDidMount() {
    this.onLoadPromotion()
    this.onLoadProducts()
    this.onLoadCategories()
    this.onLoadClassifications()
  }

  onLoadPromotion = () => {
    const { promotionId, loadPromotion } = this.props
    loadPromotion(promotionId)
  }

  onLoadProducts = (data?: any) => {
    const { loadProducts } = this.props

    loadProducts(data)
  }
  onLoadCategories = (data?: any) => {
    const { loadCategories } = this.props
    loadCategories(data)
  }
  onLoadClassifications = (data?: any) => {
    const { loadClassifications } = this.props

    loadClassifications(data)

  }
  validationSchema = yup.object({
    price: yup.number().when(['typeDiscount'], {
      is: (typeDiscount: string) => {
        if (typeDiscount === 'pricePromotion') {
          return true
        }
      },
      then: yup.number().required('Defina um valor para a promoção').min(1, 'Valor mínimo de R$ 1.00')
    }),
    discountPercentage: yup.number().when(['typeDiscount'], {
      is: (typeDiscount: string) => {
        if (typeDiscount === 'discountPromotion') {
          return true
        }
      },
      then: yup.number().required('Defina uma porcentagem % a para promoção')
        .min(1, 'Porcentagem mínima 1%').max(99, "Porcentagem máxima de 99%")
    }),
    date_start: yup.date().default(new Date()).required('Data de início Obrigatória').nullable(true),
    date_end: yup.date().default(new Date())
    .min(yup.ref('date_start'), "Data inicial deve ser maior que da final").required('Data de finalização Obrigatória').nullable(true),

  })


  handleEdit = (data: any) => {
    const { onEdit } = this.props
    onEdit(data)

    setTimeout(() => {
      this.onLoadPromotion()
      this.onLoadProducts()
    }, 1500)
  }

  render() {
    const {
      mode,
      classes,
      history,
      products,
      categories,
      classifications,
      fetching,
      promotion,
      promotionId,
      location
    } = this.props

    const price = promotion && promotion.specials ? promotion.specials[0].price : 0
    const date_start = promotion && promotion.specials ? promotion.specials[0].date_start : null
    const date_end = promotion && promotion.specials ? promotion.specials[0].date_end : null
    const typePromotion = 'product'
    const typeDiscount = promotion && promotion.specials ? promotion.specials[0].typeDiscount : ''
    const discountPercentage = promotion && promotion.specials ? promotion.specials[0].discountPercentage : 0
    const category = promotion && promotion.specials ? promotion.specials[0].category : []
    const classification = promotion && promotion.specials ? promotion.specials[0].typePromotion : []
    const quantityBlock = promotion && promotion.specials ? promotion.specials[0].quantityBlock : false
    const AllChecked = promotion && promotion.specials ? promotion.specials[0].AllChecked : false
    return (
      <Formik
        validationSchema={this.validationSchema}
        enableReinitialize
        onSubmit={this.handleEdit}
        initialValues={{
          price,
          date_end,
          date_start,
          typePromotion,
          typeDiscount,
          discountPercentage,
          category,
          classification,
          quantityBlock,
          AllChecked,
          product: promotion,
        }}
      >
        {({ errors, isValid }) => (
          <Form>
            <div className={classes.container}>
              <Button className={classes.discardbtn} onClick={() => history.push({ pathname: '/marketing/promotions', search: location.search })}>
                Cancelar
              </Button>
              <Button variant="contained"
                color="primary"
                type="submit"
                disabled={!isValid}
                className={classes.saveButton}>
                Salvar
              </Button>
            </div>
            <PaperBlock title="Editar Promoção">
              <PromotionForm
                mode={mode}
                errors={errors}
                products={products}
                product={promotion}
                fetching={fetching}
                categories={categories}
                loadCategories={this.onLoadCategories}
                promotionId={promotionId}
                classifications={classifications}
                loadProducts={this.onLoadProducts}
                loadClassifications={this.onLoadClassifications}
              />
              <SuportLink query="como+cadastrar+promoções+no+site%3F" />
            </PaperBlock>
            <Grid container={window.innerWidth < 1200} alignItems="center" justify="space-between" md={12}>
              <Button variant="contained"
                color="primary"
                type="submit"
                disabled={!isValid}
                className={classes.saveButton}>
                Salvar
              </Button>
            </Grid>
          </Form>
        )
        }
      </Formik>
    )
  }
}

export default UpdateProductPromotionPaper