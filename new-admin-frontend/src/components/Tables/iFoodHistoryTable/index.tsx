import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, withStyles, CircularProgress, TablePagination } from '@material-ui/core'
import { ArrowRight } from '@material-ui/icons'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { floatToBRL } from '../../../helpers/moneyFormat'
import { IFoodOrder } from '../../../interfaces/ifood'
import style from './style'

type Props = {
  classes: any
  fetching?: boolean
  loadIFoodOrders: (...args: any) => void
  ifoodHistory: IFoodOrder[]
  pagination: any
}

type State = {
  page: number
  limit: number
}

class IFoodHistoryTable extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      page: 0,
      limit: 20
    }
  }

  onLoad = (params?: State) => {
    const { loadIFoodOrders } = this.props
    loadIFoodOrders(params)
  }

  componentDidMount() {
    this.onLoad()
  }

  handlePaginate = (event: any, newPage: number) => {
    this.setState(
      (state: any) => ({
        ...state,
        page: newPage
      }),
      () => {
        const { limit, page } = this.state
        this.onLoad({page: page + 1, limit})
      }
    )
  }

  parseIFoodStatus(status: string): string {
    switch (status) {
      case 'CAN':
        return 'Pedido Cancelado.'
      case 'DEV':
        return 'Pedido devolvido.'
      case 'EMI':
        return 'Pedido realizado.'
      case 'FIN':
        return 'Pedido recebido pelo cliente.'
      case 'REP':
      case 'RET':
        return 'Aguardando o cliente retirar os produtos.'
      case 'ENP':
      case 'ENT':
        return 'Aguardando a entrega dos produtos para o clientes.'
      case 'SEP':
        return 'Processo de separação de produtos.'
      case 'APA':
        return 'Aguardando o pagamento.'
      case 'PE0':
        return 'O pedido está aguardando exportação (PDV).'
      case 'PE1':
        return 'O pedido foi marcado como exportado (PDV).'
      default:
        return ''
    }
  }

  _renderTableBody = () => {
    const { classes, ifoodHistory } = this.props
    if (ifoodHistory.length > 0) {
      return ifoodHistory.map((order) => (
        <TableRow key={order.ifoodCode}>
          <TableCell
            classes={{
              root: classes.tablecellroot,
            }}
          >
            <Link to={`/ifood/${order.ifoodCode}/${order.ifoodId}`} className={classes.link}>
              {order.ifoodCode}
              <ArrowRight />
            </Link>
          </TableCell>
          <TableCell
            classes={{
              root: classes.tablecellroot,
            }}
          >
            {order.partnerCode}
          </TableCell>
          <TableCell
            classes={{
              root: classes.tablecellroot,
            }}
          >
            {floatToBRL(order.price)}
          </TableCell>
          <TableCell>{this.parseIFoodStatus(order.status)}</TableCell>
        </TableRow>
      ))
    }
  }

  render() {
    const { fetching, pagination } = this.props
    const { limit, page } = this.state
    return (
      <React.Fragment>
        {fetching ? (
          <div style={{ width: '100%', height: '90%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress size={60} color="primary" />
          </div>
        ) : (
          <React.Fragment>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código do Pedido</TableCell>
                  <TableCell>Código do Parceiro</TableCell>
                  <TableCell>Valor do Pedido</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{this._renderTableBody()}</TableBody>
            </Table>
          </TableContainer>
          {pagination ? (
            <TablePagination
              rowsPerPageOptions={[5, 10, 20, 30]}
              component="div"
              count={pagination.total}
              rowsPerPage={limit}
              labelRowsPerPage="Linhas"
              page={page}
              onChangePage={this.handlePaginate}
            />
          ) : null}
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }
}

export default withStyles(style)(IFoodHistoryTable)
