import {
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  withStyles,
} from '@material-ui/core'
import React, { Component } from 'react'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import { Link } from 'react-router-dom'
import moment from 'moment'
import CustomDatePicker from '../../CustomDatePicker'
import ImportHistory, { IModuleImportType } from '../../../interfaces/importHistory'
import { Autorenew } from '@material-ui/icons'
import style from './style'
import Pagination from '../../../interfaces/pagination'

interface Filters {
  createdAt: Date
  search: string
}

interface RequestDataImport {
  id?: string
  data?: any
}

interface Props {
  classes: any
  fetching: boolean
  pagination: Pagination
  onDelete: (id?: string) => void
  importHistory: ImportHistory[]
  importDetail: ImportHistory | null
  loadDetails: ({ data }: RequestDataImport) => void
}

type State = {
  page: number
  selected: any[]
  date_start: Date
  rowsPerPage: number
  filters: Filters | null
}

class ImportingHistoryTable extends Component<Props, State> {
  static defaultProps = {
    fetching: false,
    importHistory: [],
    importDetail: null,
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
      selected: [],
      rowsPerPage: 20,
      page: 0,
      date_start: new Date(),
      filters: null,
    }

    this.EnhancedTableHead = this.EnhancedTableHead.bind(this)
  }

  _renderTextModule = (text: IModuleImportType) => {
    switch (text) {
      case 'product':
        return 'produto'
      case 'promotion':
        return 'promoção'
      case 'customer':
        return 'cliente'

      default:
        return 'modulo não definido'
    }
  }

  EnhancedTableHead() {
    const { classes } = this.props

    const cells = () => (
      <React.Fragment>
        <TableCell
          classes={{
            root: classes.selectcell,
          }}
        >
          <Grid container alignItems="center" spacing={2} />
        </TableCell>
        <TableCell
          classes={{
            head: classes.headcell,
          }}
        >
          <Typography className={classes.tableHeadTitle}>Total Enviado</Typography>
        </TableCell>
        <TableCell
          classes={{
            head: classes.headcell,
          }}
        >
          <Typography className={classes.tableHeadTitle}>Total Processados</Typography>
        </TableCell>
        <TableCell
          classes={{
            head: classes.headcell,
          }}
        >
          <Typography className={classes.tableHeadTitle}>Falhados</Typography>
        </TableCell>
        <TableCell
          classes={{
            head: classes.headcell,
          }}
        >
          <Typography className={classes.tableHeadTitle}>Tipo de importação</Typography>
        </TableCell>
        <TableCell
          classes={{
            head: classes.headcell,
          }}
          align="center"
        >
          <Typography className={classes.tableHeadTitle}>Status</Typography>
        </TableCell>
        <TableCell
          classes={{
            head: classes.headcell,
          }}
          align="center"
        >
          <Typography className={classes.tableHeadTitle}>Data</Typography>
        </TableCell>
        <TableCell
          classes={{
            head: classes.headcell,
          }}
          align="center"
        >
          <Typography className={classes.tableHeadTitle}>Desfazer Importação</Typography>
        </TableCell>
      </React.Fragment>
    )

    return (
      <React.Fragment>
        <TableHead className={classes.tablehead}>
          <TableRow
            classes={{
              root: classes.rowroot,
            }}
          >
            {cells()}
          </TableRow>
        </TableHead>
      </React.Fragment>
    )
  }

  handleChangePage = (event: any, newPage: number) => {
    const { loadDetails } = this.props
    const { rowsPerPage } = this.state

    this.setState((state: any) => ({
      ...state,
      page: newPage,
    }))

    loadDetails({ data: { page: newPage + 1, limit: rowsPerPage } })
  }

  handleChangeRowsPerPage = (event: any) => {
    const { loadDetails } = this.props

    this.setState((state: any) => ({
      ...state,
      rowsPerPage: parseInt(event.target.value, 10),
    }))

    loadDetails({ data: { page: 1, limit: this.state.rowsPerPage } })
  }

  onChangeFilters = (event: any) => {
    const { loadDetails } = this.props
    const {
      target: { value, name },
    } = event

    if (value === 'null') {
      this.setState((state: any) => ({
        ...state,
        filters: {
          search: 'null'
        }
      }))
      return loadDetails({})
    }

    this.setState((state: any) => ({
      ...state,
      filters: {
        ...state.filters,
        [name]: value,
      },
    }))

    loadDetails({ data: this.state.filters })
  }

  _renderStatusImport = (status: string) => {
    const { classes } = this.props
    switch (status) {
      case 'finished':
        return (
          <Chip
            label="Sucesso"
            classes={{
              root: classes.chipsuccess,
            }}
          />
        )
      case 'pending':
        return (
          <Chip
            label="Pendente"
            classes={{
              root: classes.chippending,
            }}
          />
        )
      case 'failure':
        return (
          <Chip
            label="Falha"
            classes={{
              root: classes.chipfail,
            }}
          />
        )

      default:
        break
    }
  }

  render() {
    const { classes, fetching, importHistory, pagination, onDelete, loadDetails } = this.props
    const { page, rowsPerPage, date_start, filters } = this.state

    return (
      <>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} lg={4}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Filtrar por tipo de importação</InputLabel>
              <Select
                fullWidth
                name="search"
                value={filters?.search}
                label="Filtrar por tipo de importação"
                variant="outlined"
                onChange={this.onChangeFilters}
                MenuProps={{
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right',
                  },
                  getContentAnchorEl: null,
                }}
              >
                <MenuItem key={0} value="product">
                  Importação de produtos
                </MenuItem>
                <MenuItem key={1} value="promotion">
                  Importação de promoções
                </MenuItem>
                <MenuItem key={2} value="null">
                  Nenhum filtro
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} lg={4}>
            <CustomDatePicker
              label="Pesquisar pela data"
              name="createdAt"
              setDate={(date: Date) => {
                this.setState((state: any) => ({
                  ...state,
                  filters: {
                    ...state.filters,
                    createdAt: date,
                  },
                  date_start: date,
                }))
                loadDetails({ data: { createdAt: date } })
              }}
              date={date_start}
            />
          </Grid>
        </Grid>
        <div className={classes.searchcontainer} />
        <TableContainer>
          <Table classes={{ root: classes.table }}>
            <this.EnhancedTableHead />
            {!fetching && importHistory.length > 0 && (
              <TableBody>
                {importHistory.map((value) => (
                  <TableRow key={value._id}>
                    <TableCell
                      classes={{
                        root: classes.tablecellroot,
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item>
                          <div className={classes.column}>
                            codigo da importação
                            <Link className={classes.id} to={`/import/${value._id}`}>
                              {value._id} <ChevronRightIcon className={classes.gotoicon} />{' '}
                            </Link>
                          </div>
                        </Grid>
                      </Grid>
                    </TableCell>
                    <TableCell
                      classes={{
                        root: classes.tablecellroot,
                      }}
                    >
                      <Typography>{value.total}</Typography>
                    </TableCell>
                    <TableCell
                      classes={{
                        root: classes.tablecellroot,
                      }}
                    >
                      <Typography>{value.processed}</Typography>
                    </TableCell>
                    <TableCell
                      classes={{
                        root: classes.tablecellroot,
                      }}
                    >
                      <Typography>{value.failures}</Typography>
                    </TableCell>
                    <TableCell
                      classes={{
                        root: classes.tablecellroot,
                      }}
                    >
                      <Typography>{this._renderTextModule(value.module)}</Typography>
                    </TableCell>
                    <TableCell
                      classes={{
                        root: classes.tablecellroot,
                      }}
                      align="center"
                    >
                      {this._renderStatusImport(value.status)}
                    </TableCell>
                    <TableCell
                      classes={{
                        root: classes.tablecellroot,
                      }}
                      align="center"
                    >
                      {moment(value.createdAt).calendar()}
                    </TableCell>
                    <TableCell
                      classes={{
                        root: classes.tablecellroot,
                      }}
                      align="center"
                    >
                      <button style={{ border: 'none', background: 'none' }} onClick={() => onDelete(value?._id)}>
                        <Autorenew style={{ cursor: 'pointer' }} fontSize="small" color="primary" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        {fetching && (
          <div className={classes.loadingcontainer}>
            <CircularProgress size={100} />
          </div>
        )}
        <TablePagination
          page={page}
          component="div"
          labelRowsPerPage="Linhas"
          count={Number(pagination?.total)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
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

export default withStyles(style)(ImportingHistoryTable)
