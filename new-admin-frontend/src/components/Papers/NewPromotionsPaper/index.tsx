import React, { Component } from 'react'
import { Button, Grid, withStyles } from '@material-ui/core'
import { RouteComponentProps } from 'react-router-dom'
import PromotionForm from '../../Forms/PromotionForm'
import Product from '../../../interfaces/product'
import PaperBlock from '../../PaperBlock'
import { Form, Formik } from 'formik'
import * as yup from 'yup'
import style from './style'
import Classification from '../../../interfaces/classification'
import SuportLink from '../../SuportLink'
import Category from '../../../interfaces/category'

interface Props extends RouteComponentProps {
  mode: any
  product?: Product | null
  classes: any
  fetching: boolean
  products: Product[]
  promotion?: Product | null
  onSave: (data: any) => void
  loadProducts: (data?: any) => void
  loadCategories: (data?: any) => void
  loadClassifications: (data?: any) => void
  classifications: Classification[]
  categories: Category[]
}


class NewPromotionPaper extends Component<Props> {
  static defaultProps = {
    fetching: false,
    promotion: null,
    products: [],
    categories: [],
    classifications: []
  }
  async componentDidMount() {
    this.onLoad()
    this.onLoadCategories()
    this.onLoadClassifications()
  }


  onLoad = (data?: any) => {
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
    product: yup.object().when(['typePromotion'], {
      is: (typePromotion: string) => typePromotion === 'product',
      then: yup.object().required('Escolha um produto').nullable(true)
    }).nullable(true),
    price: yup.number().when(['typePromotion', 'typeDiscount'], {
      is: (typePromotion: string, typeDiscount: string) => {
        if (typePromotion === 'product') {
          if (typeDiscount === 'pricePromotion') {
            return true
          }
          else return false
        }
      },
      then: yup.number().required('Defina um valor para a promoção').min(1, 'Valor mínimo de R$ 1.00')
    }),
    category: yup.array().when(['typePromotion'], {
      is: (typePromotion: string) => typePromotion === 'category',
      then: yup.array().required('Escolha uma categoria')
      .min(1, 'Deve ser escolhido no mínimo uma categoria')
    }),
    classification: yup.array().when(['typePromotion'], {
      is: (typePromotion: string) => typePromotion === 'classification',
      then: yup.array().required('Escolha uma classificação').min(1, 'Deve ser escolhido no mínimo uma classificação')
    }),
    discountPercentage: yup.number().when(['typePromotion', 'typeDiscount'], {
      is: (typePromotion: string, typeDiscount: string) => {
        if (typePromotion === 'product') {
          if (typeDiscount === 'discountPromotion') {
            return true
          }
          else return false
        }
        if (typePromotion === 'category' || typePromotion === 'classification') {
          return true
        }
        else return false
      },
      then: yup.number().required('Defina uma porcentagem % a para promoção')
      .min(1, 'Porcentagem mínima 1%').max(99, "Porcentagem máxima de 99%")
    }),
    date_start: yup.date().default(new Date()).required('Data de início Obrigatória').nullable(true),
    date_end: yup.date().default(new Date())
    .min(yup.ref('date_start'), "Data inicial deve ser menor que data final").required('Data de finalização Obrigatória').nullable(true),

  })

  handleSave = (data: any) => {
    const { onSave } = this.props
    onSave(data)

    setTimeout(() => {
      this.onLoad()
      this.onLoadClassifications()
      this.onLoadCategories()
    }, 1500)
  }

  render() {
    const { mode,
      classes,
      products,
      categories,
      classifications,
      history,
      promotion,
      fetching } = this.props
    return (
      <React.Fragment>
        <Formik
          initialValues={{
            product: null,
            date_start: null,
            date_end: null,
            status: false,
            typePromotion: 'product',
            typeDiscount: 'pricePromotion',
            price: 0,
            discountPercentage: 0,
            category: [],
            classification: [],
            quantityBlock: false,
            AllChecked: false,
            promotion,
          }}
          onSubmit={this.handleSave}
          validationSchema={this.validationSchema}
          enableReinitialize
        >

          {({ errors, isValid }) => (
            <Form>
              <div className={classes.container}>
                <Button className={classes.discardbtn} onClick={() => history.push('/marketing/promotions')}>
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
              <PaperBlock title="Nova Promoção">
                <PromotionForm
                  mode={mode}
                  errors={errors}
                  fetching={fetching}
                  products={products}
                  loadProducts={this.onLoad}
                  loadCategories={this.onLoadCategories}
                  categories={categories}
                  classifications={classifications}
                  loadClassifications={this.onLoadClassifications}
                />
                <SuportLink query="como+cadastrar+promoções+no+site%3F" />
              </PaperBlock>
              <Grid container={window.innerWidth < 1200} alignItems="center" justify="space-between" md={12}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={!isValid}
                  className={classes.saveButton}>
                  Salvar
                </Button>
              </Grid>
            </Form>
          )}
        </Formik>
      </React.Fragment>
    )
  }
}

export default withStyles(style)(NewPromotionPaper)