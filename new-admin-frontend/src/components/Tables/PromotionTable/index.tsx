import {
  CircularProgress,
  IconButton,
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
import moment from 'moment'
import DeleteIcon from '@material-ui/icons/Delete'
import Product from '../../../interfaces/product'
import EditIcon from '@material-ui/icons/Edit'
import { floatToBRL } from '../../../helpers/moneyFormat'
import style from './style'
import Pagination from '../../../interfaces/pagination'
import { RouteComponentProps } from 'react-router'

interface PaginationOptions {
  page?: number,
  limit?: number,
}

interface Props extends RouteComponentProps {
  classes: any
  fetching?: boolean
  pagination: Pagination
  promotions: Product[]
  onDelete: (id: Product['_id']) => void
  handlePaginate: (data: PaginationOptions) => void
}

type State = {
  page: number
  rowsPerPage: number
}

class PromotionTable extends Component<Props, State> {
  static defaultProps = {
    pagination: {
      pages: 0,
      total: 0,
      limit: 20,
      currentPage: 1,
    },
  }
  constructor(props: any) {
    super(props)
    this.state = {
      page: 0,
      rowsPerPage: 5,
    }
  }

  handleChangePage = (event: any, newPage: number) => {
    const { handlePaginate } = this.props

    this.setState(
      {
        ...this.state,
        page: newPage,
      },
      () => {
        handlePaginate({ page: newPage + 1, limit: this.state.rowsPerPage })
      }
    )
  }

  handleChangeRowsPerPage = (event: any) => {
    const { handlePaginate } = this.props

    this.setState(
      {
        ...this.state,
        page: 0,
        rowsPerPage: parseInt(event.target.value, 10),
      },
      () => {
        handlePaginate({ page: 1, limit: this.state.rowsPerPage })
      }
    )
  }

  render() {
    const { classes, promotions, fetching, history, location, pagination, onDelete } = this.props
    const { rowsPerPage } = this.state

    return (
      <React.Fragment>
        {fetching ? (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <CircularProgress size={80} color="primary" />
          </div>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  classes={{
                    root: classes.tablerow,
                  }}
                >
                  <TableCell
                    classes={{
                      root: classes.tablecell,
                    }}
                  >
                    Nome
                  </TableCell>
                  <TableCell
                    classes={{
                      root: classes.tablecell,
                    }}
                  >
                    Valor de desconto
                  </TableCell>
                  <TableCell
                    classes={{
                      root: classes.tablecell,
                    }}
                  >
                    Data
                  </TableCell>
                  <TableCell
                    classes={{
                      root: classes.tablecell,
                    }}
                  >
                    Editar
                  </TableCell>
                  <TableCell
                    classes={{
                      root: classes.tablecell,
                    }}
                    align="right"
                  >
                    Excluir
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {promotions.map((promotion) => {
                  const { specials = [] } = promotion

                  const specialPrice = specials ? specials[0].price : 0
                  const dateStart = specials ? specials[0].date_start : null
                  const dateEnd = specials ? specials[0].date_end : null

                  return (
                    <TableRow key={promotion._id}>
                      <TableCell
                        classes={{
                          root: classes.tablecellbody,
                        }}
                      >
                        {promotion.name}
                      </TableCell>
                      <TableCell
                        classes={{
                          root: classes.tablecellbody,
                        }}
                      >
                        {floatToBRL(specialPrice)}
                      </TableCell>
                      <TableCell
                        classes={{
                          root: classes.tablecellbody,
                        }}
                      >
                        Inicia em {moment(dateStart).utc().format('LLL')} <br />
                        Termina{' '}
                        {dateEnd
                          ? moment(dateEnd).utc().format('LLL')
                          : 'Sem data especificada'}
                      </TableCell>
                      <TableCell
                        classes={{
                          root: classes.tablecellbody,
                        }}
                      >
                        <IconButton onClick={() => history.push({ pathname: `/marketing/promotions/${promotion._id}`, search: location.search.toString() })}>
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell
                        align="right"
                        classes={{
                          root: classes.tablecellbody,
                        }}
                      >
                        <IconButton onClick={() => onDelete(promotion._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <TablePagination
          page={pagination.currentPage - 1}
          component="div"
          count={pagination.total}
          rowsPerPage={rowsPerPage}
          labelRowsPerPage="Linhas"
          rowsPerPageOptions={[5, 10, 20, 50]}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </React.Fragment>
    )
  }
}

export default withStyles(style)(PromotionTable)
