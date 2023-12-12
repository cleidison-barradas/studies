import {
    IconButton,
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
import { DeleteOutlined } from '@material-ui/icons'
import ptBR from 'date-fns/esm/locale/pt-BR/index.js'
import format from 'date-fns/format/index.js'
import { Field, FieldProps } from 'formik'
import React from 'react'
import { Component } from 'react'
import { Link } from 'react-router-dom'
import { StoreConsumer } from '../../../context/StoreContext'
import Pagination from '../../../interfaces/pagination'
import Store from '../../../interfaces/store'
import styles from './styles'

interface Props {
    classes: Record<keyof ReturnType<typeof styles>, string>
    stores: Store[]
    pagination?: Pagination
}

class StoresTable extends Component<Props> {
    render() {
        const { stores, pagination } = this.props
        return (
            <StoreConsumer>
                {({ getStores, deleteStore }) => (
                    <React.Fragment>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableCell>Nome</TableCell>
                                    <TableCell>URL</TableCell>
                                    <TableCell>Tenant</TableCell>
                                    <TableCell>Pmc</TableCell>
                                    <TableCell>Criada em</TableCell>
                                    <TableCell>Desativar</TableCell>
                                </TableHead>
                                <TableBody>
                                    {stores.map((store: Store) => (
                                        <TableRow key={store._id}>
                                            <TableCell>
                                                <MuiLink component={Link} to={`/stores/${store._id}`}>
                                                    {store.name}
                                                </MuiLink>
                                            </TableCell>
                                            <TableCell>{store.url}</TableCell>
                                            <TableCell>{store.tenant}</TableCell>
                                            <TableCell>{store.pmc?.name || 'Não possui'}</TableCell>
                                            <TableCell>
                                                {store.createdAt
                                                    ? format(new Date(store.createdAt), 'dd/MM/yyyy', {
                                                        locale: ptBR,
                                                    })
                                                    : null}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    onClick={async () => {
                                                        await deleteStore(store._id)
                                                        await getStores({ page: pagination!.currentPage })
                                                    }}
                                                >
                                                    <DeleteOutlined />
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
                                            count={pagination.total}
                                            page={pagination.currentPage - 1}
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
                    </React.Fragment>
                )}
            </StoreConsumer>
        )
    }
}

export default withStyles(styles)(StoresTable)
