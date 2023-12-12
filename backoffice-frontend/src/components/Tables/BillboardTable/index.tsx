import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton } from '@material-ui/core'
import { EditOutlined, DeleteOutlined } from '@material-ui/icons'
import { format } from 'date-fns'
import React, { Component } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { BillboardConsumer } from '../../../context/BillboardContext'

interface Props extends RouteComponentProps {
    refresh: () => Promise<void>
}

class BillboardTable extends Component<Props> {
    render() {
        const { refresh, history } = this.props
        return (
            <BillboardConsumer>
                {({ billboards, deleteBillboard }) => (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Titulo</TableCell>
                                    <TableCell>Começa em</TableCell>
                                    <TableCell>Termina em</TableCell>
                                    <TableCell>Criado em</TableCell>
                                    <TableCell>Editar</TableCell>
                                    <TableCell>Excluir</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {billboards.map((value) => (
                                    <TableRow key={value._id}>
                                        <TableCell>{value.title}</TableCell>
                                        <TableCell>{format(new Date(value.startAt), 'dd/MM/yyyy')}</TableCell>
                                        <TableCell>{format(new Date(value.endAt), 'dd/MM/yyyy')}</TableCell>
                                        <TableCell>{format(new Date(value.createdAt!), 'dd/MM/yyyy')}</TableCell>
                                        <TableCell onClick={() => history.push(`/billboard/${value._id}`)}>
                                            <IconButton>
                                                <EditOutlined />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                onClick={async () => {
                                                    await deleteBillboard(value._id)
                                                    await refresh()
                                                }}
                                            >
                                                <DeleteOutlined />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </BillboardConsumer>
        )
    }
}

export default withRouter(BillboardTable)
