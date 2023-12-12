import {
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  withStyles,
} from '@material-ui/core'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ImportData from '../../../interfaces/importData'

import styles from './style'

interface Props {
  module: string
  products: ImportData[]
  classes: Record<keyof ReturnType<typeof styles>, string>
}

type State = {
  page: number
  rowsPerPage: number
  filtered: any[]
}

class ImportTable extends Component<Props, State> {
  static defaultProps = {
    products: [],
  }
  constructor(props: any) {
    super(props)

    this.state = {
      page: 0,
      rowsPerPage: 5,
      filtered: [],
    }
    this.handleChangePage = this.handleChangePage.bind(this)
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this)
  }

  handleChangePage(event: any, newPage: number) {
    this.setState({
      ...this.state,
      page: newPage,
    })
  }

  handleChangeRowsPerPage(event: any) {
    this.setState({
      ...this.state,
      page: 0,
      rowsPerPage: parseInt(event.target.value, 10),
    })
  }

  _renderButtons = (action: string, module: string, product: ImportData) => {
    const { classes } = this.props

    switch (module) {
      case 'promotion':
        return (
          <Button variant="contained" className={classes.registerbtn}>
            {action === 'undo' ? 'Remover promoção' : 'Cadastrar'}
          </Button>
        )

      case 'product':
        return (
          <Link className={classes.registerbtn} to={{ pathname: '/products/add', state: { product } }}>
            {action === 'undo' ? 'Remover' : 'Cadastrar'}
          </Link>
        )
      default:
        return (
          <Link className={classes.registerbtn} to="/products/">
            Nenhuma acao definida
          </Link>
        )
    }
  }
  _renderChipLabel = (action: string, module: string, message: string) => {
    const text = {
      invalid_price: 'preço inválido',
      invalid_stock: 'estoque inválido',
      invalid_product: 'produto inválido',
      product_not_found: 'produto não encontrado',
    } as any

    switch (module) {
      case 'promotion':
        return <Chip color="primary" label={action === 'undo' ? 'Remover Promoção' : 'Criar Promoção'} />

      case 'product':
        return <Chip color="primary" label={text[message]} />

      default:
        return <Chip color="primary" label="Nenhuma ação definida" />
    }
  }

  render() {
    const { classes, module, products } = this.props
    const { rowsPerPage, page } = this.state

    return (
      <>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>EAN</TableCell>
                <TableCell>Preço</TableCell>
                <TableCell>Quantidade</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Apresentação</TableCell>
                <TableCell width="10%" align="center">
                  Situação
                </TableCell>
                <TableCell width="10%" align="center">
                  Ação
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => (
                <TableRow key={product.EAN}>
                  <TableCell classes={{ root: classes.cellroot }}>{product.EAN}</TableCell>
                  <TableCell classes={{ root: classes.cellroot }}>{product.price}</TableCell>
                  <TableCell classes={{ root: classes.cellroot }}>{product.quantity} UN</TableCell>
                  <TableCell classes={{ root: classes.cellroot }}>{product.name}</TableCell>
                  <TableCell classes={{ root: classes.cellroot }}>{product.presentation}</TableCell>
                  <TableCell align="center" classes={{ root: classes.cellroot }}>
                    {this._renderChipLabel(product.action, module, product.message)}
                  </TableCell>
                  <TableCell align="center" classes={{ root: classes.cellroot }}>
                    {this._renderButtons(product.action, module, product)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={products.length}
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
      </>
    )
  }
}

export default withStyles(styles)(ImportTable)
