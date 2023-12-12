import {
    Checkbox,
    CircularProgress,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography,
} from '@material-ui/core'
import React, { Component } from 'react'
import DeleteIcon from '@material-ui/icons/Delete'
import classNames from 'classnames'
import DeliveryFeeInterface from '../../../interfaces/deliveryFee'
import { floatToBRL } from '../../../helpers/moneyFormat'

type Props = {
    classes: any
    deliveryFees: DeliveryFeeInterface[]
    pagination: any
    fetching: boolean
    deletedId: string | null
    onUpdating: boolean
    loadDeliveries: (id?: string, page?: any, limit?: any) => void
    handleEdit: (data: any) => void
    handleDelete: (data?: any) => void
}

type State = {
    page: number
    limit: number
    selected: any
    data: {
        deliveryData: DeliveryFeeInterface[]
        editing: boolean
        loading: boolean
    }
}

export default class DeliveryPolitcsTable extends Component<Props, State> {
    static defaultProps = {
        deliveryFees: [],
        fetching: false,
        pagination: undefined,
        deletedId: null,
        onUpdating: false,
    }

    constructor(props: any) {
        super(props)
        this.state = {
            data: {
                deliveryData: [],
                editing: false,
                loading: true,
            },
            page: 0,
            limit: 20,
            selected: [],
        }

        this.EnhancedTableHead = this.EnhancedTableHead.bind(this)
    }

    UNSAFE_componentWillReceiveProps(newProps: any) {
        const { deliveryFees, fetching, onUpdating } = newProps
        const newState = Object.assign({}, this.state)

        if (!fetching && deliveryFees.length > 0) {
            newState.data.loading = false
            newState.data.deliveryData = deliveryFees
        }

        if (onUpdating) {
            newState.data.deliveryData = []
        }

        if (newState !== this.state) {
            this.setState(newState)
        }
    }
    deleteDeliveries = () => {
        const { handleDelete } = this.props
        const { selected } = this.state
        handleDelete(selected)

        this.setState({
            selected: [],
        })
    }

    setStateDeliveries = (deliveries: any) => {
        this.setState(
            (state: any) => ({
                ...state,
                data: {
                    ...state,
                    deliveryData: deliveries,
                },
            }),
            () => {
                this.setState((state) => ({
                    ...state,
                    data: {
                        ...state.data,
                        editing: true,
                    },
                }))
            }
        )
    }

    handlePaginate = (page?: number, limit?: number) => {
        const { loadDeliveries } = this.props
        loadDeliveries(undefined, page, limit)
    }

    selectPaymentMethod(id: any) {
        let selecteds = this.state.selected

        const found = selecteds.find((value: any) => value === id)

        if (found) {
            selecteds = selecteds.filter((value: any) => value !== id)
        } else {
            selecteds.push(id)
        }

        this.setState({
            ...this.state,
            selected: [...selecteds],
        })
    }

    edit = ({ target: { name, value } }: any) => {
        const { handleEdit } = this.props
        const {
            selected,
            data: { deliveryData },
        } = this.state

        const aux = deliveryData
        const ids = selected

        aux.map((delivery: any) => {
            if (ids.includes(delivery._id)) {
                delivery[name] = value.replace(/,/g, '.')
            }
            return delivery
        })

        this.setState((state: any) => ({
            ...state,
            updating: true,
        }))

        this.setStateDeliveries(aux)
        handleEdit(aux)
    }

    selectAll = () => {
        const {
            selected,
            data: { deliveryData },
        } = this.state

        if (selected.length === deliveryData.length) {
            return this.setState({
                ...this.state,
                selected: [],
            })
        }

        const ids = deliveryData.map((value) => value._id)

        this.setState({
            ...this.state,
            selected: [...ids],
        })
    }

    deleteHead = () => {
        const {
            selected,
            data: { deliveryData },
        } = this.state
        const selecteds = selected

        const filtered = deliveryData.filter((value) => !selecteds.includes(value._id))
        this.setStateDeliveries(filtered)
        this.deleteDeliveries()
    }

    deleteOne = (id: any) => {
        const {
            data: { deliveryData },
        } = this.state
        const deliveryPolitics = deliveryData

        const filtered = deliveryPolitics.filter((value) => value._id !== id)
        this.setStateDeliveries(filtered)
        this.deleteDeliveries()
    }

    handleChangePage = (event: any, newPage: number) => {
        const { limit } = this.state
        this.setState(
            {
                ...this.state,
                page: newPage,
            },
            () => {
                this.handlePaginate(newPage + 1, limit)
            }
        )
    }

    handleChangeRowsPerPage = (event: any) => {
        const { value } = event.target
        this.setState(
            {
                ...this.state,
                page: 0,
                limit: parseInt(value, 10),
            },
            () => {
                this.handlePaginate(1, value)
            }
        )
    }

    select = (id: any) => {
        const { selected } = this.state

        const ids = selected

        if (ids.includes(id)) {
            const filtered = ids.filter((value: any) => value !== id)
            return this.setState({
                ...this.state,
                selected: [...filtered],
            })
        } else {
            ids.push(id)
            return this.setState({
                ...this.state,
                selected: [...ids],
            })
        }
    }

    EnhancedTableHead() {
        const {
            selected,
            data: { deliveryData },
        } = this.state
        const { classes } = this.props

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
                            checked={deliveryData.length > 0 && selected.length === deliveryData.length}
                            onChange={this.selectAll}
                        />
                    </TableCell>
                    {selected.length === 0 ? (
                        <React.Fragment>
                            <TableCell
                                width={window.innerWidth < 600 ? '100%' : '30%'}
                                classes={{
                                    head: classes.row,
                                }}
                            >
                                <Typography className={classes.tableHeadTitle}>Cidade</Typography>
                            </TableCell>
                            <TableCell
                                width="25%"
                                classes={{
                                    head: classes.row,
                                }}
                            >
                                <Typography className={classes.tableHeadTitle}>Bairros</Typography>
                            </TableCell>
                            <TableCell
                                width="10%"
                                classes={{
                                    head: classes.row,
                                }}
                            >
                                <Typography className={classes.tableHeadTitle}>Taxa</Typography>
                            </TableCell>
                            <TableCell
                                width="10%"
                                classes={{
                                    head: classes.row,
                                }}
                            >
                                <Typography className={classes.tableHeadTitle}>Grátis</Typography>
                            </TableCell>
                            <TableCell
                                width="10%"
                                classes={{
                                    head: classes.row,
                                }}
                            >
                                <Typography className={classes.tableHeadTitle}>Mínimo</Typography>
                            </TableCell>
                            <TableCell
                                width="10%"
                                classes={{
                                    head: classes.row,
                                }}
                            >
                                <Typography className={classes.tableHeadTitle}>Tempo</Typography>
                            </TableCell>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <TableCell
                                width="30%"
                                classes={{
                                    head: classes.row,
                                }}
                            >
                                <Typography className={classes.tableHeadTitle}>Cidade</Typography>
                            </TableCell>
                            <TableCell
                                width="25%"
                                classes={{
                                    head: classes.row,
                                }}
                            >
                                <Typography className={classes.tableHeadTitle}>Bairros</Typography>
                            </TableCell>
                            <TableCell
                                width="10%"
                                classes={{
                                    head: classes.row,
                                }}
                            >
                                <TextField
                                    label="Taxa"
                                    variant="outlined"
                                    className={classes.textblack}
                                    classes={{
                                        root: classes.thinputroot,
                                    }}
                                    type="decimal"
                                    name="feePrice"
                                    onChange={this.edit}
                                />
                            </TableCell>
                            <TableCell
                                width="10%"
                                classes={{
                                    head: classes.row,
                                }}
                            >
                                <TextField
                                    label="Grátis"
                                    variant="outlined"
                                    name="freeFrom"
                                    className={classes.textblack}
                                    classes={{
                                        root: classes.thinputroot,
                                    }}
                                    type="decimal"
                                    onChange={this.edit}
                                />
                            </TableCell>
                            <TableCell
                                width="10%"
                                classes={{
                                    head: classes.row,
                                }}
                            >
                                <TextField
                                    label="Mínimo"
                                    variant="outlined"
                                    name="minimumPurchase"
                                    className={classes.textblack}
                                    classes={{
                                        root: classes.thinputroot,
                                    }}
                                    type="decimal"
                                    onChange={this.edit}
                                />
                            </TableCell>
                            <TableCell
                                width="10%"
                                classes={{
                                    head: classes.row,
                                }}
                            >
                                <TextField
                                    label="Mínimo"
                                    variant="outlined"
                                    name="deliveryTime"
                                    className={classes.textblack}
                                    classes={{
                                        root: classes.thinputroot,
                                    }}
                                    type="decimal"
                                    onChange={this.edit}
                                />
                            </TableCell>
                        </React.Fragment>
                    )}
                    <TableCell
                        width="5%"
                        align="center"
                        classes={{
                            head: classes.row,
                        }}
                    >
                        {deliveryData.length > 0 && selected.length === deliveryData.length ? (
                            <IconButton
                                onClick={this.deleteHead}
                                classes={{
                                    root: classes.deletebtn,
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        ) : null}
                    </TableCell>
                </TableRow>
            </TableHead>
        )
    }

    _renderTableBody = () => {
        const { classes } = this.props
        const {
            selected,
            data: { deliveryData },
        } = this.state

        if (deliveryData.length > 0) {
            return deliveryData.map((delivery) => (
                <TableRow
                    key={delivery._id}
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
                        <Checkbox checked={selected.includes(delivery._id)} onChange={() => this.select(delivery._id)} />
                    </TableCell>
                    <TableCell
                        width="30%"
                        classes={{
                            root: classes.row,
                        }}
                    >
                        <input
                            value={delivery.neighborhood.city.name}
                            disabled={true}
                            className={classNames(classes.text, classes.input)}
                        />
                    </TableCell>
                    <TableCell
                        width="25%"
                        classes={{
                            root: classes.row,
                        }}
                    >
                        <input
                            value={delivery.neighborhood.name}
                            disabled={true}
                            className={classNames(classes.text, classes.input)}
                        />
                    </TableCell>
                    <TableCell
                        width="10%"
                        align="center"
                        classes={{
                            root: classes.row,
                        }}
                    >
                        <input
                            type="decimal"
                            value={floatToBRL(delivery.feePrice)}
                            disabled={true}
                            className={classNames(classes.text, classes.input)}
                        />
                    </TableCell>
                    <TableCell
                        width="10%"
                        align="center"
                        classes={{
                            root: classes.row,
                        }}
                    >
                        <input
                            type="decimal"
                            value={floatToBRL(delivery.freeFrom)}
                            disabled={true}
                            className={classNames(classes.text, classes.input)}
                        />
                    </TableCell>
                    <TableCell
                        width="10%"
                        align="center"
                        classes={{
                            root: classes.row,
                        }}
                    >
                        <input
                            type="decimal"
                            value={floatToBRL(delivery.minimumPurchase)}
                            disabled={true}
                            className={classNames(classes.text, classes.input)}
                        />
                    </TableCell>
                    <TableCell
                        width="10%"
                        classes={{
                            root: classes.row,
                        }}
                    >
                        <input
                            type="decimal"
                            value={delivery.deliveryTime + 'min'}
                            disabled={true}
                            className={classNames(classes.text, classes.input)}
                        />
                    </TableCell>
                    <TableCell
                        width="5%"
                        align="center"
                        classes={{
                            root: classes.row,
                        }}
                    >
                        {selected.includes(delivery._id) ? (
                            <IconButton
                                onClick={() => this.deleteOne(delivery._id)}
                                classes={{
                                    root: classes.deletebtn,
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        ) : null}
                    </TableCell>
                </TableRow>
            ))
        }
    }

    render() {
        const { classes, pagination, onUpdating, fetching } = this.props
        const { page, limit } = this.state
        return (
            <React.Fragment>
                {onUpdating || fetching ? (
                    <div className={classes.fetchingcontainer}>
                        <CircularProgress size={50} color="primary" />
                    </div>
                ) : (
                    <TableContainer>
                        <Table>
                            <this.EnhancedTableHead />
                            <TableBody>{this._renderTableBody()}</TableBody>
                        </Table>
                    </TableContainer>
                )}
                {pagination !== undefined ? (
                    <TablePagination
                        rowsPerPageOptions={[0, 5, 10, 30]}
                        count={pagination.total}
                        rowsPerPage={limit}
                        labelRowsPerPage="Linhas"
                        component="div"
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
