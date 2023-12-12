import { Button, withStyles } from '@material-ui/core'
import { Form, Formik } from 'formik'
import { isEqual } from 'lodash'
import { Component } from 'react'
import { RouteComponentProps } from 'react-router'
import Category from '../../../interfaces/category'
import Pagination from '../../../interfaces/pagination'
import Product from '../../../interfaces/product'
import { GetCategoryRequest, GetProductRequest } from '../../../services/api/interfaces/ApiRequest'
import ProductFilterForm from '../../Forms/ProductFilterForm'
import PaperBlock from '../../PaperBlock'
import ProductTable from '../../Tables/ProductTable'
import styles from './styles'

interface Props extends RouteComponentProps {
  products: Product[]
  categories: Category[]
  pagination?: Pagination
  deleteProduct: (id: string) => Promise<void>
  getProduct: (data: GetProductRequest) => Promise<void>
  getCategory: (data?: GetCategoryRequest) => Promise<void>
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class ProductsPaper extends Component<Props> {
  initialValues: GetProductRequest = {
    limit: 10,
    page: 1,
    start: undefined,
    end: undefined,
    category: undefined,
  }

  async componentDidMount() {
    await this.onLoad()
  }

  onLoad = async () => {
    const { getProduct, getCategory } = this.props
    await getProduct(this.initialValues)
    await getCategory()
  }
  getUrlSearchParams = (search: any) => {
    const { history } = this.props
    let searchObj: Record<any, any> = {}

    if (search) {
      const searchParams = new URLSearchParams(search)

      if (searchParams.has('page')) searchObj = { ...searchObj, page: searchParams.get('page') }
      if (searchParams.has('limit')) searchObj = { ...searchObj, limit: searchParams.get('limit') }
      if (searchParams.has('query')) searchObj = { ...searchObj, query: searchParams.get('query') }

      if (Object.keys(searchObj).length > 0) {
        const searchWithKeys = new URLSearchParams({ ...searchObj })

        history.push({
          pathname: window.location.pathname,
          search: searchWithKeys.toString(),
          state: searchWithKeys.toString(),
        })
      }
    }
    return searchObj
  }

  handleSubmit = async (data: GetProductRequest) => {
    const { getProduct } = this.props

    if (Object.keys(data).length >= 0) {
      await getProduct(data)
    }
  }

  handleDelete = async (id: string) => {
    const { deleteProduct } = this.props
    await deleteProduct(id)

    setTimeout(() => {
      this.onLoad()
    }, 500)
  }

  render() {
    const { products, categories, getProduct, pagination, history, classes } = this.props
    return (
      <Formik initialValues={this.initialValues} onSubmit={this.handleSubmit}>
        {({ isSubmitting, initialValues, values }) => (
          <Form>
            <div className={classes.flexEnd}>
              <Button variant="contained" color="primary" onClick={() => history.push('/product/new')}>
                Cadastrar produto
              </Button>
            </div>
            <PaperBlock title="Produtos">
              <ProductFilterForm
                getProduct={getProduct}
                categories={categories}
                isSubmitting={isSubmitting}
                equal={isEqual(initialValues, values)}
              />
              <ProductTable
                products={products}
                categories={categories}
                pagination={pagination}
                deleteProduct={this.handleDelete}
              />
            </PaperBlock>
          </Form>
        )}
      </Formik>
    )
  }
}

export default withStyles(styles)(ProductsPaper)
