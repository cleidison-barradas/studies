import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  withStyles,
} from '@material-ui/core'
import { Component } from 'react'
import { Link } from 'react-router-dom'
import { Field, FieldProps } from 'formik'
import { Delete } from '@material-ui/icons'
import moment from 'moment'
import { BucketS3 } from '../../../config'

import Product from '../../../interfaces/product'
import Category from '../../../interfaces/category'
import Pagination from '../../../interfaces/pagination'

import ImagePlaceholder from '../../../assets/images/nophoto.jpg'
import { GetProductRequest } from '../../../services/api/interfaces/ApiRequest'
import styles from './styles'

interface Props {
  products: Product[]
  categories: Category[]
  pagination?: Pagination
  submitForm?: () => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class ProductTable extends Component<Props> {
  initialValues: GetProductRequest = {
    limit: 10,
    page: 1,
  }

  render() {
    const { products, classes, pagination, deleteProduct } = this.props
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Imagem</TableCell>
              <TableCell>
                Nome <br /> (EAN)
              </TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Fabricante</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Criado em</TableCell>
              <TableCell>Excluir</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products &&
              products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <Link to={`/product/${product._id}`}>
                      <div className={classes.productimage}>
                        <img src={product.image ? `${BucketS3}/${product.image.key}` : ImagePlaceholder} alt="product" />
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link to={`/product/${product._id}`} className={classes.link}>
                      {product.name} <br /> ({product.EAN})
                    </Link>
                  </TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.manufacturer ? product.manufacturer.name : 'Sem fabricante'}</TableCell>
                  <TableCell>
                    {product.category && typeof product.category === 'object'
                      ? product.category.map((c) => c.name).join(', ')
                      : 'Sem categoria'}
                  </TableCell>
                  <TableCell>{moment(product.createdAt).format('DD/MM/YYYY')}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={async () => {
                        if (product._id) await deleteProduct(product._id)
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {pagination && (
          <Field name="limit">
            {({ form }: FieldProps) => (
              <TablePagination
                component={'div'}
                count={pagination.total}
                rowsPerPage={pagination.limit}
                rowsPerPageOptions={[10, 50, 100]}
                page={pagination.currentPage - 1}
                onChangeRowsPerPage={(e) => {
                  form.setFieldValue('limit', e.target.value)
                  form.submitForm()
                }}
                onChangePage={(_, page) => {
                  form.setFieldValue('page', page + 1)
                  form.submitForm()
                }}
              />
            )}
          </Field>
        )}
      </TableContainer>
    )
  }
}

export default withStyles(styles)(ProductTable)
