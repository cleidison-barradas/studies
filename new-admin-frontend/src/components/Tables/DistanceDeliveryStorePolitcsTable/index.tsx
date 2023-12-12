/* eslint-disable no-useless-computed-key */
import { Component } from 'react'
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
  TableRow,
  Typography,
} from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import DistanceDeliveryFee from '../../../interfaces/distanceDeliveryFee'
import { Field, FieldArray, FieldArrayRenderProps } from 'formik'
import { floatToBRL } from '../../../helpers/moneyFormat'
// @ts-ignore
import CurrencyField from 'react-currency-input'
import TextFormField from '../../TextFormField'
import styles from './styles'

interface Props {
  fetching: boolean
  distanceDeliveries: DistanceDeliveryFee[]
  handleDelete: (ids: string[]) => void
  onEdit: (data: any, id: any) => void
  classes: Record<keyof ReturnType<typeof styles>, string>
  setFieldValue: () => void
}
interface State {
  selected: DistanceDeliveryFee['_id'][]
  inputs: {
    distance: number
    feePrice: number
    freeFrom: number
    minimumPurchase: number
    deliveryTime: number
  }
}

class DistanceDeliveryStorePoliticsTable extends Component<Props, State> {
  static defaultProps = {
    fetching: false,
    distanceDeliveries: [],
  }

  state: State = {
    selected: [],
    inputs: {
      distance: 0,
      feePrice: 0,
      freeFrom: 0,
      minimumPurchase: 0,
      deliveryTime: 0,
    },
  }

  onSelect = (id: DistanceDeliveryFee['_id']) => {
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
    const { distanceDeliveries } = this.props
    const { selected } = this.state

    if (distanceDeliveries.length === selected.length) {
      return this.setState((state: any) => ({
        ...state,
        selected: [],
      }))
    }

    this.setState((state: any) => ({
      selected: distanceDeliveries.map((x) => x._id),
    }))
  }

  handleChangeFields = (field: string, value: number) => {
    const { selected } = this.state
    const { distanceDeliveries, onEdit } = this.props

    distanceDeliveries.forEach((item: any) => {
      if (selected.includes(item._id)) {
        item[field] = value

        onEdit(item, item._id)
      }
    })
  }


  EnhancedTableHead = () => {
    const { classes, distanceDeliveries, handleDelete } = this.props
    const { selected, inputs } = this.state

    return (
      <TableHead>
        <TableRow classes={{ root: classes.rowroot }}>
          <TableCell width="1%">
            <Checkbox  onClick={this.selectAll}  style={{paddingLeft:'16px'}} checked={distanceDeliveries.length > 0 && selected.length === distanceDeliveries.length} />
          </TableCell>
          <TableCell width='5%' align="center" classes={{ head: classes.row }}>
            <Typography className={classes.tableHeadTitle}>Distância</Typography>
          </TableCell>
          <TableCell width="10%" align="center" classes={{ head: classes.row }}>
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
          <TableCell width="10%" align="center" classes={{ head: classes.row }}>
            {selected.length > 0 && (
              <div className={classes.currencyDiv}>
                <span className={classes.currencyLabel}>Grátis a partir</span>
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
          <TableCell width="10%" align="center" classes={{ head: classes.row }}>
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
          <TableCell width="10%" align="center" classes={{ head: classes.row }}>
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
            {distanceDeliveries.length > 0 && selected.length === distanceDeliveries.length && (
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
    const { classes, fetching, handleDelete } = this.props
    const { selected } = this.state

    return (
      <FieldArray
        name="distanceDeliveries"
        render={({ form, push }: FieldArrayRenderProps) => (
          <TableContainer classes={{ root: classes.tableContainer }}>
            <Table>
              <this.EnhancedTableHead />
              <TableBody>
                {fetching && (
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size={120} color="secondary" />
                  </div>
                )}
                {!fetching &&
                  form.values.distanceDeliveries &&
                  form.values.distanceDeliveries.length > 0 &&
                  form.values.distanceDeliveries.map((delivery: DistanceDeliveryFee, index: number) => (
                    <TableRow key={index} classes={{ root: classes.rowroot }}>
                      <TableCell  width="1%">
                        <Checkbox style={{paddingLeft:'0'}} checked={selected.includes(delivery._id)} onClick={() => this.onSelect(delivery._id)} />
                      </TableCell>
                      <TableCell width="5%"  align="center" classes={{ root: classes.row }}>
                        {delivery.distance/1000} Km
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
            </Table >

          </TableContainer>
        )}
      />
    )
  }
}

export default withStyles(styles)(DistanceDeliveryStorePoliticsTable)
