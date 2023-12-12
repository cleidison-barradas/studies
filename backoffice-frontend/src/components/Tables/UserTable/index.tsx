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
import { Field, FieldProps } from 'formik'
import React from 'react'
import { Component } from 'react'
import { Link } from 'react-router-dom'
import { UserConsumer } from '../../../context/UserContext'
import Pagination from '../../../interfaces/pagination'
import User from '../../../interfaces/user'
import styles from './styles'

interface Props {
    classes: Record<keyof ReturnType<typeof styles>, string>
    users: User[]
    pagination?: Pagination
}

class UserTable extends Component<Props> {
    render() {
        const { users, pagination } = this.props
        return (
            <UserConsumer>
                {({ getUsers, deleteUser }) => (
                    <React.Fragment>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableCell>Username</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Tipo</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Desativar</TableCell>
                                </TableHead>
                                <TableBody>
                                    {users.map((user: User) => (
                                        <TableRow key={user._id}>
                                            <TableCell>
                                                <MuiLink component={Link} to={`/users/${user._id}`}>
                                                    {user.userName}
                                                </MuiLink>
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.role}</TableCell>
                                            <TableCell>{user.status}</TableCell>
                                            <TableCell>
                                                <IconButton
                                                    onClick={async () => {
                                                        await deleteUser(user._id!)
                                                        await getUsers({ page: pagination!.currentPage })
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
            </UserConsumer>
        )
    }
}

export default withStyles(styles)(UserTable)
