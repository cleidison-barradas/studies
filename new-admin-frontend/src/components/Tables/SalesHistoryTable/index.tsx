import {
  Box,
  Button,
  Checkbox,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  withStyles,
  CircularProgress,
  Chip,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core'
import { ArrowRight, Delete } from '@material-ui/icons'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import MyPharmaLogo from '../../../assets/images/icons/logo.png'
import iFoodLogo from '../../../assets/images/icons/ifood-logo.png'
import PluggtoLogo from '../../../assets/images/icons/pluggto-logo.png'
import { ReactComponent as GreySearchIcon } from '../../../assets/images/greySearchIcon.svg'

import OrderStatus from '../../../interfaces/orderStatus'
import Order from '../../../interfaces/order'

import moment from 'moment'
import style from './style'
import { floatToBRL } from '../../../helpers/moneyFormat'
import { ISalesHistoryFilter } from '../../../interfaces/salesHistoryFilters'
import { loadStorage, saveStorage } from '../../../services/storage'
import Keys from '../../../services/storageKeys'
import { RequestSalesHistory } from '../../../services/api/interfaces/ApiRequest'
import PaymentMethods from '../../../interfaces/paymentMethods'

type Props = {
  classes: any
  salesHistory: Order[]
  fetching?: boolean
  pagination: any
  status: OrderStatus[]
  loadOrderStatus: () => void
  onDelete: (data: any) => void
  loadHistoryOrders: (data?: RequestSalesHistory) => void
  getPaymentMethods: (data?: any) => void
  methods: PaymentMethods[]
}

type State = {
  selected: Order['_id'][]
  filters: ISalesHistoryFilter
  orderMethod?: any
}

class SalesHistoryTable extends Component<Props, State> {
  static defaultProps = {
    salesHistory: [],
  }

  state: State = {
    selected: [],
    filters: {
      page: 0,
      limit: 20,
      prefix: '',
      search: '',
      statusOrder: '',
      orderMethod: '',
    },
  }

  onLoad = (params?: RequestSalesHistory) => {
    const { loadHistoryOrders } = this.props

    setTimeout(() => {
      loadHistoryOrders(params)
    }, 1200)
  }
  componentDidMount() {
    const { loadOrderStatus, getPaymentMethods } = this.props
    loadOrderStatus()
    getPaymentMethods({})

    const filters = loadStorage<ISalesHistoryFilter>(Keys.ORDERS_KEY)

    if (filters) {
      this.setState(
        {
          filters,
        },
        () => {
          this.onLoad({
            ...this.state.filters,
            page: filters.page ? filters.page + 1 : 1,
          })
        }
      )
    } else {
      this.onLoad()
    }
  }

  handlePaginate = (event: any, newPage: number) => {
    this.setState(
      (state) => ({
        ...state,
        filters: {
          ...state.filters,
          page: newPage,
        },
      }),
      () => {
        saveStorage(Keys.ORDERS_KEY, this.state.filters)
        const page = this.state.filters.page || 0
        const limit = this.state.filters.limit || 20

        this.onLoad({
          ...this.state.filters,
          limit,
          page: page + 1,
        })
      }
    )
  }

  handleRowPerPage = ({ target: { value } }: any) => {
    this.setState(
      (state) => ({
        ...state,
        filters: {
          ...state.filters,
          page: 0,
          limit: parseInt(value, 10),
        },
      }),
      () => {
        saveStorage(Keys.ORDERS_KEY, this.state.filters)

        this.onLoad({
          ...this.state.filters,
          page: 1,
        })
      }
    )
  }

  select = (_id: Order['_id']) => {
    const { selected } = this.state

    if (selected.includes(_id)) {
      const filtred = selected.filter((id) => id !== _id)

      this.setState({
        selected: filtred,
      })
    } else {
      selected.push(_id)

      this.setState({
        selected,
      })
    }
  }

  selectAll = () => {
    const { selected } = this.state
    const { salesHistory } = this.props

    if (selected.length === salesHistory.length) {
      this.setState((state: any) => ({
        ...state,
        selected: [],
      }))
    } else {
      const filtred = salesHistory.map((sale) => sale._id)

      this.setState((state: any) => ({
        ...state,
        selected: filtred,
      }))
    }
  }

  unselectAll = () => {
    this.setState((state: any) => ({
      ...state,
      selected: [],
    }))
  }

  unSelectMany = (_id: Order['_id'][]) => {
    const { selected } = this.state
    const filtred = selected.filter((value) => !_id.includes(value))

    this.setState((state: any) => ({
      ...state,
      selected: filtred,
    }))
  }

  handleDelete = (id?: string) => {
    const { onDelete } = this.props
    const { selected } = this.state

    if (selected.length > 0) {
      const values = {
        orders: selected,
      }
      onDelete(values)

      setTimeout(() => {
        this.onLoad()
      }, 1500)
    }

    if (id) {
      selected.push(id)

      const values = {
        orders: selected,
      }
      onDelete(values)

      setTimeout(() => {
        this.onLoad()
      }, 1500)
    }
    this.setState({
      selected: [],
    })
  }

  handleChange = ({ target: { name, value } }: any) => {
    this.setState(
      (state) => ({
        ...state,
        filters: {
          ...state.filters,
          page: 0,
          limit: 20,
          [name]: value.trimEnd(),
        },
      }),
      () => {
        saveStorage(Keys.ORDERS_KEY, this.state.filters)

        this.onLoad({
          ...this.state.filters,
          page: 1,
          limit: 20,
        })
      }
    )
  }

  formatFilterText = (field: string, value: string) => {
    const { status, methods } = this.props

    if (field.includes('statusOrder')) return status.find((s) => s._id?.toString().includes(value))?.name

    if (field.includes('orderMethod')) return methods.find((s) => s.paymentOption.name?.toString().includes(value))?.paymentOption.name

    return value
  }

  clearFilters = (name?: string) => {
    if (name) {
      this.setState(
        (state) => ({
          ...state,
          filters: {
            ...state.filters,
            page: 0,
            limit: 20,
            [name]: '',
          },
        }),
        () => {
          saveStorage(Keys.ORDERS_KEY, this.state.filters)

          this.onLoad({
            ...this.state.filters,
            page: 1,
          })
        }
      )
    }
  }

  CustomTableHead = () => {
    const { selected } = this.state
    const { classes, salesHistory } = this.props

    return (
      <TableHead>
        <TableRow>
          <TableCell
            padding="checkbox"
            classes={{
              root: classes.tablecellroot,
            }}
          >
            <Checkbox checked={selected.length === salesHistory.length} onChange={this.selectAll} />
          </TableCell>
          <TableCell>Nº Pedido</TableCell>
          <TableCell>Cliente</TableCell>
          <TableCell>Origem</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Estoque</TableCell>
          <TableCell>Total</TableCell>
          <TableCell>Cadastro</TableCell>
          <TableCell align="center">Excluir</TableCell>
        </TableRow>
      </TableHead>
    )
  }
  _renderTableBody = () => {
    const { salesHistory = [], classes } = this.props
    const { selected } = this.state

    return salesHistory.map((sale) => {
      const totalOrderWithFee = sale?.paymentMethod?.details?.payment_quota ? sale?.totalOrder +  sale?.paymentMethod?.details?.payment_quota : sale?.totalOrder

      return (
        <TableRow key={sale._id}>
          <TableCell
            padding="checkbox"
            classes={{
              root: classes.tablecellroot,
            }}
          >
            <Checkbox checked={selected.includes(sale._id)} onChange={() => this.select(sale._id)} />
          </TableCell>
          <TableCell
            classes={{
              root: classes.tablecellroot,
            }}
          >
            <Link to={`/sale/${sale._id}`} className={classes.link}>
              {sale._id}
              <ArrowRight />
            </Link>
          </TableCell>
          <TableCell
            classes={{
              root: classes.tablecellroot,
            }}
          >
            {sale.customer?.firstname} {sale.customer?.lastname}
          </TableCell>
          <TableCell>
          <img
            className={classes.logoImage}
              src={sale.prefix?.toLowerCase().includes('ifood') ? iFoodLogo : sale.prefix?.toLowerCase().includes('pluggto') ? PluggtoLogo : MyPharmaLogo}
              alt="origin indicator"
            />
          </TableCell>
          <TableCell
            classes={{
              root: classes.tablecellroot,
            }}
          >
            {sale.statusOrder.name}
          </TableCell>
          <TableCell
          classes={{
            root: classes.tablecellroot,
          }}
        >
          {sale.stock === 'virtual' ? 'Virtual' : 'Físico'}
        </TableCell>
        <TableCell
            classes={{
              root: classes.tablecellroot,
            }}
          >
            {floatToBRL(totalOrderWithFee)}
          </TableCell>
          <TableCell
            classes={{
              root: classes.tablecellroot,
            }}
          >
            {moment(sale.createdAt).calendar()}
          </TableCell>
          <TableCell
            align="center"
            classes={{
              root: classes.tablecellroot,
            }}
          >
            <IconButton onClick={() => this.handleDelete(sale._id)}>
              <Delete />
            </IconButton>
          </TableCell>
        </TableRow>
      )
    })


  }

  salesFilters = () => {
    const { classes, status = [], methods } = this.props
    const { filters } = this.state

    return (
      <Box>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
              <TextField
                fullWidth
                name="search"
                variant="outlined"
                autoComplete="off"
                value={filters.search}
                onChange={this.handleChange}
                placeholder="Pesquise pelo cliente ou número do pedido"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        classes={{
                          root: classes.searchiconroot,
                        }}
                      >
                        <GreySearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
              <FormControl variant="outlined" className={classes.formcontrol} fullWidth>
                <InputLabel id="label-status">Status</InputLabel>
                <Select
                  name="statusOrder"
                  label="Status"
                  variant="outlined"
                  labelId="label-status"
                  value={filters.statusOrder}
                  onChange={this.handleChange}
                  MenuProps={{
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'right',
                    },
                    getContentAnchorEl: null,
                  }}
                >
                  {status.map((value) => (
                    <MenuItem key={value._id} value={value._id}>
                      {value.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
              <FormControl variant="outlined" className={classes.formcontrol} fullWidth>
                <InputLabel>Formas de pagamento</InputLabel>
                <Select
                  label="Formas de pagamento"
                  variant="outlined"
                  name="orderMethod"
                  onChange={this.handleChange}
                  value={filters.orderMethod}
                  MenuProps={{
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'right',
                    },
                    getContentAnchorEl: null,
                  }}
                >
                  {methods?.map((value) => (
                    <MenuItem key={value._id} value={value.paymentOption.name}>
                      {value.paymentOption.name} ({' '}
                      {value.paymentOption.type === 'gateway' || value.paymentOption.type === 'ticket' ? 'online' : 'na entrega'}{' '}
                      )
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
              <FormControl variant="outlined" className={classes.formcontrol} fullWidth>
                <InputLabel id="label-prefix">Origem do pedido</InputLabel>
                <Select
                  name="prefix"
                  value={filters.prefix}
                  variant="outlined"
                  labelId="label-prefix"
                  label="Origem do pedido"
                  onChange={this.handleChange}
                  MenuProps={{
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'right',
                    },
                    getContentAnchorEl: null,
                  }}
                >
                  <MenuItem key="0" value="E-commerce">
                    E-commerce
                  </MenuItem>
                  <MenuItem key="1" value="iFood">
                    Ifood
                  </MenuItem>
                  <MenuItem key="2" value="Pluggto">
                    Pluggto
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        <Box mt={2}>
          <Grid container spacing={3}>
            {Object.keys(filters)
              .filter((k) => filters[k].length > 0)
              .map((key) => (
                <Grid item key={key}>
                  <Chip label={this.formatFilterText(key, filters[key])} onDelete={() => this.clearFilters(key)} />
                </Grid>
              ))}
          </Grid>
        </Box>
      </Box>
    )
  }

  render() {
    const { classes, fetching, pagination } = this.props
    const { filters, selected } = this.state

    return (
      <Box>
        {this.salesFilters()}
        {fetching ? (
          <div style={{ width: '100%', height: '90%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress size={60} color="primary" />
          </div>
        ) : (
          <TableContainer>
            {selected.length > 0 ? (
              <Box mt={2}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Button variant="outlined" classes={{ root: classes.checkboxbtn }}>
                      <Checkbox classes={{ root: classes.checkbox }} checked={true} onChange={this.unselectAll} />
                      {`${selected.length} na seleção`}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" classes={{ contained: classes.deletebtn }} onClick={() => this.handleDelete()}>
                      excluir
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            ) : null}
            <Table style={{ marginTop: selected.length > 0 ? 0 : '' }}>
              {selected.length <= 0 && this.CustomTableHead()}

              <TableBody>{this._renderTableBody()}</TableBody>
            </Table>
          </TableContainer>
        )}
        {pagination && (
          <TablePagination
            component="div"
            page={filters.page || 0}
            count={pagination.total}
            labelRowsPerPage="Linhas"
            rowsPerPage={filters.limit || 20}
            onChangePage={this.handlePaginate}
            rowsPerPageOptions={[5, 10, 20, 30]}
            onChangeRowsPerPage={this.handleRowPerPage}
            labelDisplayedRows={(paginationInfo) => `Página ${paginationInfo.page + 1} - ${paginationInfo.count} Itens`}
          />
        )}
      </Box>
    )
  }
}

export default withStyles(style)(SalesHistoryTable)
