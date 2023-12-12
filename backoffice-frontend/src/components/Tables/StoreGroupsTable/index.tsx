import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  withStyles
} from '@material-ui/core'
import { DeleteOutlined } from '@material-ui/icons'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Pagination from '../../../interfaces/pagination'
import StoreGroup from '../../../interfaces/storeGroup'
import { GetStoreGroupsRequest } from '../../../services/api/interfaces/ApiRequest'
import styles from './styles'

interface Props {
    classes: Record<keyof ReturnType<typeof styles>, string>
    storeGroups: StoreGroup[]
    pagination?: Pagination
    getStoreGroups: (data?: GetStoreGroupsRequest) => Promise<void>
}

class StoreGroupsTable extends Component<Props> {
  render () {
    const { storeGroups, pagination, getStoreGroups } = this.props
    return (
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableCell align="center">Nome</TableCell>
                        <TableCell align="center">Lojas</TableCell>
                        <TableCell align="center">Excluir</TableCell>
                    </TableHead>
                    <TableBody>
                        {storeGroups.map(({ name, stores, _id }: StoreGroup) => (
                            <TableRow key={_id}>
                                <TableCell align="center">
                                    <Link to={`/store/groups/${_id}`}>{name}</Link>
                                </TableCell>
                                <TableCell align="center">{stores.length}</TableCell>
                                <TableCell align="center">
                                    <IconButton>
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
                        page={pagination.page}
                        onChangeRowsPerPage={(e) =>
                          getStoreGroups({
                            ...pagination,
                            limit: Number(e.target.value)
                          })
                        }
                        onChangePage={(_, page: number) => getStoreGroups({ ...pagination, page })}
                        rowsPerPage={pagination.limit}
                        component="div"
                    />
                )}
            </TableContainer>
    )
  }
}

export default withStyles(styles)(StoreGroupsTable)
