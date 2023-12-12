import {
    Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    withStyles,
} from '@material-ui/core'
import React, { Component } from 'react'
import { ErpConsumer } from '../../../context/ErpContext'
import styles from './styles'
import { DeleteOutlined } from '@material-ui/icons'
import { RouteComponentProps, Link as RouterLink } from 'react-router-dom'

interface Props {
    classes: Record<keyof ReturnType<typeof styles>, string>
    history: RouteComponentProps['history']
}

class ErpTable extends Component<Props> {
    render() {
        return (
            <ErpConsumer>
                {({ erps, pagination, getErps, deleteErp }) => (
                    <React.Fragment>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>id</TableCell>
                                    <TableCell>Nome</TableCell>
                                    <TableCell>Excluir</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {erps.map((erp) => (
                                    <TableRow key={erp._id}>
                                        <TableCell>
                                            <Button color="primary" component={RouterLink} to={`erp/${erp._id}`}>
                                                {erp._id}
                                            </Button>
                                        </TableCell>
                                        <TableCell>{erp.name}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                onClick={async () => {
                                                    await deleteErp(erp._id)
                                                    await getErps({
                                                        limit: Number(pagination?.limit),
                                                        page: pagination?.page,
                                                    })
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
                            <TablePagination
                                count={pagination.total}
                                page={pagination.currentPage - 1}
                                rowsPerPageOptions={[20, 50, 100]}
                                onChangeRowsPerPage={async (e) => {
                                    await getErps({ limit: Number(e.target.value) })
                                }}
                                onChangePage={async (e, page) => {
                                    await getErps({ limit: Number(pagination.limit), page: page + 1 })
                                }}
                                rowsPerPage={pagination.limit}
                                component="div"
                            />
                        )}
                    </React.Fragment>
                )}
            </ErpConsumer>
        )
    }
}

export default withStyles(styles)(ErpTable)
