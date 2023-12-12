/* eslint-disable prefer-const */
import React, { Component } from 'react'
import {
    Checkbox,
    IconButton,
    Table,
    TableContainer,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    TablePagination,
    Typography,
    CircularProgress,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import classNames from 'classnames'
import PaymentInterface from '../../../interfaces/paymentMethods'

type State = {
    page: number
    rowsPerPage: number
    selected: any
    initialState: any
    data: {
        paymentMethods: PaymentInterface[]
    }
    deleteData: {
        payments: any[]
    }
}

type Props = {
    classes: any
    fetching: boolean
    paymentMethods: PaymentInterface[]
    pagination: any
    loadPayments: (id?: string, page?: any, limit?: any) => void
    onDelete: (data: any) => void
    onEditing: (data: any) => void
}

export default class PaymentMethodTable extends Component<Props, State> {
    static defaultProps = {
        fetching: false,
        paymentMethods: [],
    }

    constructor(props: any) {
        super(props)
        this.state = {
            initialState: {},
            page: 0,
            rowsPerPage: 20,
            selected: [],
            data: {
                paymentMethods: [],
            },
            deleteData: {
                payments: [],
            },
        }
    }

    UNSAFE_componentWillReceiveProps(newProps: any) {
        const { paymentMethods, fetching } = newProps
        const newState = Object.assign({}, this.state)

        if (!fetching && paymentMethods.length > 0) {
            newState.data.paymentMethods = paymentMethods
        }

        if (newState !== this.state) {
            this.setState(newState)
        }
    }

    setStatePayment = (payment: any) => {
        const { onEditing } = this.props
        const newState = Object.assign({}, this.state)

        newState.data.paymentMethods = payment
        this.setState(newState)
        onEditing(payment)
    }

    setPayment = ({ target: { value, id } }: any) => {
        const { data } = this.state
        const { paymentMethods } = data

        for (const payment of paymentMethods) {
            if (payment._id === id) {
                payment.paymentOption.name = value
            }
        }
        this.setStatePayment(paymentMethods)
    }

    handleDelete = () => {
        const { onDelete, loadPayments } = this.props
        const { selected } = this.state

        if (selected.length > 0) {
            onDelete(selected)
            loadPayments()
        }
    }

    selectAll = () => {
        const {
            selected,
            data: { paymentMethods },
        } = this.state

        if (selected.length === paymentMethods.length) {
            return this.setState({
                selected: [],
            })
        }
        const selecteds = paymentMethods.map((payment) => payment._id)

        this.setState({
            selected: [...selecteds],
        })
    }

    deleteHead = () => {
        const {
            selected,
            data: { paymentMethods },
        } = this.state

        const filters = paymentMethods.filter((payment) => !selected.includes(payment._id))

        this.setStatePayment(filters)
        this.handleDelete()
    }

    deleteOne = (id: any) => {
        const {
            data: { paymentMethods },
        } = this.state

        const filters = paymentMethods.filter((payment) => payment._id !== id)

        this.setStatePayment(filters)
        this.handleDelete()
    }

    handleChangePage = (event: any, newPage: number) => {
        const { rowsPerPage } = this.state
        const { loadPayments } = this.props
        this.setState(
            {
                page: newPage,
            },
            () => {
                loadPayments(undefined, newPage + 1, rowsPerPage)
            }
        )
    }

    handleChangeRowsPerPage = (event: any) => {
        const { loadPayments } = this.props
        const { value } = event.target

        this.setState(
            {
                page: 0,
                rowsPerPage: parseInt(value, 10),
            },
            () => {
                loadPayments(undefined, 1, parseInt(value, 10))
            }
        )
    }

    select = ({ target: { name, value } }: any) => {
        const { selected } = this.state
        const ids = selected

        if (ids.includes(value)) {
            const filtered = ids.filter((id: any) => id !== value)

            return this.setState((state: any) => ({
                ...state,
                selected: [...filtered],
            }))
        } else {
            ids.push(value)
            return this.setState((state: any) => ({
                ...state,
                selected: [...ids],
            }))
        }
    }

    EnhancedTableHead = () => {
        const { classes } = this.props
        const {
            selected,
            data: { paymentMethods },
        } = this.state

        return (
            <TableHead>
                <TableRow
                    classes={{
                        root: classes.rowroot,
                    }}
                >
                    <TableCell
                        padding="checkbox"
                        classes={{
                            root: classes.cellrowroot,
                        }}
                    >
                        <Checkbox
                            checked={paymentMethods.length > 0 && selected.length === paymentMethods.length}
                            onChange={this.selectAll}
                        />
                    </TableCell>
                    <TableCell
                        width="100%"
                        classes={{
                            head: classes.row,
                        }}
                    >
                        <Typography className={classes.tableHeadTitle}>Forma de pagamento</Typography>
                        {paymentMethods.length > 0 && selected.length === paymentMethods.length ? (
                            <IconButton
                                onClick={this.deleteHead}
                                classes={{
                                    root: classes.deletebtn,
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        ) : (
                            ''
                        )}
                    </TableCell>
                </TableRow>
            </TableHead>
        )
    }

    _renderTablebody = () => {
        const { classes } = this.props
        const {
            data: { paymentMethods },
            selected,
        } = this.state

        if (paymentMethods.length > 0) {
            return paymentMethods.map((payment) => (
                <TableRow
                    key={payment._id}
                    classes={{
                        root: classes.rowroot,
                    }}
                >
                    <TableCell
                        padding="checkbox"
                        classes={{
                            root: classes.cellrowroot,
                        }}
                    >
                        <Checkbox
                            checked={selected.includes(payment._id)}
                            value={payment._id}
                            name="selected"
                            onChange={this.select}
                        />
                    </TableCell>
                    <TableCell
                        width="100%"
                        classes={{
                            root: classes.row,
                        }}
                    >
                        <input
                            id={payment._id}
                            value={payment.paymentOption.name}
                            className={classNames(classes.text, selected.includes(payment._id) ? classes.edit : classes.input)}
                            onChange={this.setPayment}
                        />
                        {selected.includes(payment._id) ? (
                            <IconButton
                                onClick={(e) => this.deleteOne(payment._id)}
                                classes={{
                                    root: classes.deletebtn,
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        ) : (
                            ''
                        )}
                    </TableCell>
                </TableRow>
            ))
        }
    }

    render() {
        const { classes, fetching, pagination } = this.props
        const { page, rowsPerPage } = this.state

        return (
            <React.Fragment>
                {fetching ? (
                    <div className={classes.fetchingcontainer}>
                        <CircularProgress size={60} color="primary" />
                    </div>
                ) : (
                    <TableContainer>
                        <Table
                            classes={{
                                root: classes.tableroot,
                            }}
                        >
                            <this.EnhancedTableHead />
                            <TableBody>{this._renderTablebody()}</TableBody>
                        </Table>
                    </TableContainer>
                )}

                {pagination !== undefined ? (
                    <TablePagination
                        rowsPerPageOptions={[0, 5, 10, 25]}
                        component="div"
                        count={pagination.total}
                        rowsPerPage={rowsPerPage}
                        labelRowsPerPage="Linhas"
                        page={page}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        classes={{
                            actions: classes.paginationarrows,
                            root: classes.paginationroot,
                        }}
                    />
                ) : null}
            </React.Fragment>
        )
    }
}
