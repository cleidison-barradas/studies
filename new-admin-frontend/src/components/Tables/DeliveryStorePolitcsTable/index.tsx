/* eslint-disable no-useless-computed-key */
import React, { Component } from 'react'
import { withStyles } from '@material-ui/styles'
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
  Typography,
} from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import DeliveryFee from '../../../interfaces/deliveryFee'
import { Field, FieldArray, FieldArrayRenderProps } from 'formik'
import { floatToBRL } from '../../../helpers/moneyFormat'
// @ts-ignore
import CurrencyField from 'react-currency-input'
import TextFormField from '../../TextFormField'
import Pagination from '../../../interfaces/pagination'
import styles from './styles'

interface Props {
  fetching: boolean
  deliveries: DeliveryFee[]
  pagination: Pagination
  handleDelete: (ids: string[]) => void
  onEdit: (data: any, id: any) => void
  classes: Record<keyof ReturnType<typeof styles>, string>
  paginateDeliveries: (id?: string, page?: number, limit?: number) => void
}
interface State {
  selected: DeliveryFee['_id'][]
  inputs: {
    feePrice: number
    freeFrom: number
    minimumPurchase: number
    deliveryTime: number
  }
  page: number
  limit: number
}

class DeliveryStorePoliticsTable extends Component<Props, State> {
  static defaultProps = {
    fetching: false,
    deliveries: [],
    pagination: {
      pages: 0,
      limit: 0,
      total: 0,
      currentPage: 1,
    },
  }

  state: State = {
    selected: [],
    inputs: {
      feePrice: 0,
      freeFrom: 0,
      minimumPurchase: 0,
      deliveryTime: 0,
    },
    page: 0,
    limit: 15,
  }

  onSelect = (id: DeliveryFee['_id']) => {
    let { selected } = this.state

    if (selected.includes(id)) {
      selected = selected.filter((x) => x !== id)
      return this.setState((state: any) => ({
        ...state,
        selected,
      }))
    }
    selected.push(id)

    this.setState((state: any) => ({
      ...state,
      selected,
    }))
  }

  selectAll = () => {
    const { deliveries } = this.props
    const { selected } = this.state

    if (deliveries.length === selected.length) {
      return this.setState((state: any) => ({
        ...state,
        selected: [],
      }))
    }

    this.setState((state: any) => ({
      selected: deliveries.map((x) => x._id),
    }))
  }

  handleChangeFields = (field: string, value: number) => {
    const { selected } = this.state
    const { deliveries, onEdit } = this.props

    deliveries.forEach((item: any) => {
      if (selected.includes(item._id)) {
        item[field] = value

        onEdit(item, item._id)
      }
    })
  }

  handleRows = (event: any) => {
    const { value } = event.target
    const { paginateDeliveries } = this.props

    this.setState((state: any) => ({
      ...state,
      page: 0,
      limit: parseInt(value, 10),
    }))
    paginateDeliveries(undefined, this.state.page, parseInt(value, 10))
  }

  handleChangePage = (event: any, page: number) => {
    const { paginateDeliveries } = this.props

    this.setState((state: any) => ({
      ...state,
      page,
    }))
    paginateDeliveries(undefined, page + 1, this.state.limit)
  }

  EnhancedTableHead = () => {
    const { classes, deliveries, handleDelete } = this.props
    const { selected, inputs } = this.state

    return (
      <TableHead>
        <TableRow classes={{ root: classes.rowroot }}>
          <TableCell padding="checkbox" classes={{ root: classes.cellrowroot }}>
            <Checkbox onClick={this.selectAll} checked={deliveries.length > 0 && selected.length === deliveries.length} />
          </TableCell>
          <TableCell width={window.innerWidth < 600 ? '100%' : '30%'} classes={{ head: classes.row }}>
            <Typography className={classes.tableHeadTitle}>Cidade</Typography>
          </TableCell>
          <TableCell width="25%" classes={{ head: classes.row }}>
            <Typography className={classes.tableHeadTitle}>Bairro</Typography>
          </TableCell>
          <TableCell width="10%" classes={{ head: classes.row }}>
            {selected.length > 0 && (
              <div className={classes.currencyDiv}>
                <span className={classes.currencyLabel}>Taxa de Entrega</span>
                <CurrencyField
                  prefix="R$ "
                  name="feePrice"
                  value={inputs.feePrice}
                  className={classes.inputs}
                  thousandSeparator="."
                  decimalSeparator=","
                  onChangeEvent={(_: any, maskedValue: any, floatValue: number) => {
                    this.setState((state: any) => ({
                      ...state,
                      inputs: {
                        ...state.inputs,
                        ['feePrice']: floatValue,
                      },
                    }))
                    this.handleChangeFields('feePrice', floatValue)
                  }}
                />
              </div>
            )}
            {selected.length <= 0 && <Typography className={classes.tableHeadTitle}>Taxa de Entrega</Typography>}
          </TableCell>
          <TableCell width="10%" classes={{ head: classes.row }}>
            {selected.length > 0 && (
              <div className={classes.currencyDiv}>
                <span className={classes.currencyLabel}>Gratis a partir</span>
                <CurrencyField
                  prefix="R$ "
                  name="freeFrom"
                  value={inputs.freeFrom}
                  className={classes.inputs}
                  thousandSeparator="."
                  decimalSeparator=","
                  onChangeEvent={(_: any, maskedValue: any, floatValue: number) => {
                    this.setState((state: any) => ({
                      ...state,
                      inputs: {
                        ...state.inputs,
                        ['freeFrom']: floatValue,
                      },
                    }))
                    this.handleChangeFields('freeFrom', floatValue)
                  }}
                />
              </div>
            )}
            {selected.length <= 0 && <Typography className={classes.tableHeadTitle}>Grátis a partir de</Typography>}
          </TableCell>
          <TableCell width="10%" classes={{ head: classes.row }}>
            {selected.length > 0 && (
              <div className={classes.currencyDiv}>
                <span className={classes.currencyLabel}>Taxa Miníma</span>
                <CurrencyField
                  prefix="R$ "
                  value={inputs.minimumPurchase}
                  name="minimumPurchase"
                  className={classes.inputs}
                  thousandSeparator="."
                  decimalSeparator=","
                  onChangeEvent={(_: any, maskedValue: any, floatValue: number) => {
                    this.setState((state: any) => ({
                      ...state,
                      inputs: {
                        ...state.inputs,
                        ['minimumPurchase']: floatValue,
                      },
                    }))
                    this.handleChangeFields('minimumPurchase', floatValue)
                  }}
                />
              </div>
            )}
            {selected.length <= 0 && <Typography className={classes.tableHeadTitle}>Taxa Miníma</Typography>}
          </TableCell>
          <TableCell width="10%" classes={{ head: classes.row }}>
            {selected.length > 0 && (
              <div>
                <Field
                  type="number"
                  classesName={classes.inputTime}
                  name="deliveryTime"
                  autoComplete="off"
                  value={inputs.deliveryTime}
                  label="Tempo"
                  component={TextFormField}
                  onChange={({ target }: any) => {
                    this.setState((state: any) => ({
                      ...state,
                      inputs: {
                        ...state.inputs,
                        ['deliveryTime']: Number(target.value),
                      },
                    }))
                    this.handleChangeFields('deliveryTime', Number(target.value))
                  }}
                />
              </div>
            )}
            {selected.length <= 0 && <Typography className={classes.tableHeadTitle}>Tempo de Entrega</Typography>}
          </TableCell>
          <TableCell
            width="5%"
            align="center"
            classes={{
              head: classes.row,
            }}
          >
            {deliveries.length > 0 && selected.length === deliveries.length && (
              <IconButton
                onClick={() => {
                  handleDelete(selected)

                  this.setState((state: any) => ({
                    ...state,
                    selected: [],
                  }))
                }}
                classes={{ root: classes.deletebtn }}
              >
                <Delete />
              </IconButton>
            )}
          </TableCell>
        </TableRow>
      </TableHead>
    )
  }

  render() {
    const { classes, pagination, fetching, handleDelete } = this.props
    const { page, limit, selected } = this.state

    return (
      <FieldArray
        name="deliveries"
        render={({ form, push }: FieldArrayRenderProps) => (
          <TableContainer>
            <Table>
              <this.EnhancedTableHead />
              <TableBody>
                {fetching && (
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size={120} color="secondary" />
                  </div>
                )}
                {!fetching &&
                  form.values.deliveries &&
                  form.values.deliveries.length > 0 &&
                  form.values.deliveries.map((delivery: DeliveryFee, index: number) => (
                    <TableRow key={index} classes={{ root: classes.rowroot }}>
                      <TableCell padding="checkbox" classes={{ root: classes.cellrowroot }}>
                        <Checkbox checked={selected.includes(delivery._id)} onClick={() => this.onSelect(delivery._id)} />
                      </TableCell>
                      <TableCell width="30%" classes={{ root: classes.row }}>
                        {delivery.neighborhood.city.name}
                      </TableCell>
                      <TableCell width="25%" classes={{ root: classes.row }}>
                        {delivery.neighborhood.name}
                      </TableCell>
                      <TableCell width="10%" align="center" classes={{ root: classes.row }}>
                        {floatToBRL(delivery.feePrice)}
                      </TableCell>
                      <TableCell width="10%" align="center" classes={{ root: classes.row }}>
                        {floatToBRL(delivery.freeFrom)}
                      </TableCell>
                      <TableCell width="10%" align="center" classes={{ root: classes.row }}>
                        {floatToBRL(delivery.minimumPurchase)}
                      </TableCell>
                      <TableCell width="10%" align="center" classes={{ root: classes.row }}>
                        {delivery.deliveryTime} min
                      </TableCell>
                      {
                        <TableCell width="5%" align="center" classes={{ root: classes.row }}>
                          {selected.includes(delivery._id) && (
                            <IconButton
                              onClick={() => {
                                handleDelete(selected)

                                this.setState((state: any) => ({
                                  ...state,
                                  selected: [],
                                }))
                              }}
                              classes={{ root: classes.deletebtn }}
                            >
                              <Delete />
                            </IconButton>
                          )}
                        </TableCell>
                      }
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              page={page}
              count={pagination.total}
              component="div"
              rowsPerPage={limit}
              labelRowsPerPage="Linhas"
              onChangePage={this.handleChangePage}
              rowsPerPageOptions={[0, 5, 15, 20, 30, 50]}
              onChangeRowsPerPage={this.handleRows}
              classes={{
                actions: classes.paginationarrows,
                root: classes.paginationroot,
              }}
            />
          </TableContainer>
        )}
      />
    )
  }
}

export default withStyles(styles)(DeliveryStorePoliticsTable)
