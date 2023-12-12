import React, { Component } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  withStyles,
  Link as MuiLink,
  TablePagination,
} from '@material-ui/core'
import { Field, FieldProps } from 'formik'
import { Link } from 'react-router-dom'
import Pagination from '../../../interfaces/pagination'
import Store from '../../../interfaces/store'
import styles from './styles'

interface Props {
  stores: Store[]
  pagination?: Pagination
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class StoreFlashipTable extends Component<Props> {
  render() {
    const { stores = [], pagination } = this.props
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableCell>Nome</TableCell>
            <TableCell>URL</TableCell>
          </TableHead>
          <TableBody>
            {stores.length > 0 ? (
              stores.map((store: Store) => (
                <TableRow key={store._id}>
                  <TableCell>
                    <MuiLink component={Link} to={`/store/headstore/${store._id}`}>
                      {store.name}
                    </MuiLink>
                  </TableCell>
                  <TableCell>{store.url}</TableCell>
                </TableRow>
              ))
            ) : null}
          </TableBody>
        </Table>
        {pagination && (
          <Field name="limit">
            {({ form }: FieldProps) => (
              <TablePagination
                count={pagination.total}
                page={pagination.currentPage - 1}
                labelRowsPerPage="Linhas por página"
                rowsPerPageOptions={[20, 50, 100]}
                onChangeRowsPerPage={(e) => {
                  form.setFieldValue('limit', e.target.value)
                  form.submitForm()
                }}
                onChangePage={(e, page) => {
                  form.setFieldValue('page', page + 1)
                  form.submitForm()
                }}
                rowsPerPage={pagination.limit}
                component="div"
              />
            )}
          </Field>
        )}
      </TableContainer>
    )
  }
}

export default withStyles(styles)(StoreFlashipTable)
