import {
  Box,
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  withStyles,
} from '@material-ui/core'
import PaperBlock from '../../PaperBlock'

import style from './style'
import { ReactComponent as GreySearchIcon } from '../../../assets/images/greySearchIcon.svg'
import DatePicker from '../../CustomDatePicker'
import Customer from '../../../interfaces/customer'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import CostumerTable from '../../Tables/CostumerTable'
import moment from 'moment'
import { loadStorage, saveStorage } from '../../../services/storage'
import StorageKey from '../../../services/storageKeys'
import Plan from '../../../interfaces/plan'
import CustomComponent from '../../CustomComponent'

type Props = {
  classes: any
  customers: Customer[]
  getCustomers: (...args: any) => void
  onDelete: (...args: any) => void
  plan: Plan
  fetching: any
  total: number
}

type RequestGetCustomers = {
  createdAt: MaterialUiPickersDate
  search: string
  status: string
  type: string
  method: string
  advancedFilter?: string
}

type State = {
  filters: RequestGetCustomers
  page: number
  rowsPerPage: number
}

const parseStatus = {
  true: 'Habilitado',
  false: 'Desabilitado',
} as any

const parseAdvancedFilter = {
  mostOrders: 'Comprados frequentes',
  continuousMedicamentsOrders: 'Compradores de medicamentos de uso contínuo',
} as any

class CustomersPaper extends CustomComponent<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      filters: {
        createdAt: null,
        search: '',
        status: '',
        type: '',
        method: '',
      },
      page: 0,
      rowsPerPage: 10,
    }
    this.setFilters = this.setFilters.bind(this)
    this.handlePage = this.handlePage.bind(this)
    this.handleRows = this.handleRows.bind(this)
  }

  setFilters(value: any, field: any) {
    this.setState(
      (state) => ({
        ...state,
        filters: {
          ...state.filters,
          [field]: value,
        },
      }),
      async () => {
        await saveStorage(StorageKey.CUSTOMER_KEY, this.state.filters)

        field === 'search'
          ? setTimeout(() => {
              this.load(this.state.filters)
            }, 1000)
          : this.load(this.state.filters)
      }
    )
  }

  handlePage(event: any, newPage: number) {
    this.setState(
      {
        ...this.state,
        page: newPage,
      },
      () => {
        this.load()
      }
    )
  }

  load = async (data?: any) => {
    const { getCustomers } = this.props
    const { page, rowsPerPage } = this.state
    await getCustomers({ page: page + 1, limit: rowsPerPage, ...data })
  }

  handleRows(event: any) {
    this.setState(
      {
        ...this.state,
        rowsPerPage: event.target.value,
      },
      () => {
        this.load()
      }
    )
  }

  onDelete = async (_id: Customer['_id'] | Customer['_id'][]) => {
    const { onDelete, getCustomers } = this.props
    await onDelete(_id)
    await getCustomers()
  }

  componentDidMount() {
    const filters = loadStorage<RequestGetCustomers>(StorageKey.CUSTOMER_KEY)
    if (filters) {
      this.setState(
        (state) => ({
          ...state,
          filters,
        }),
        async () => {
          this.load(this.state.filters)
        }
      )
    } else {
      this.load()
    }
  }

  render() {
    const { classes, customers, fetching, getCustomers, total, plan } = this.props

    const isInstitutional = plan.rule === 'institutional'

    const {
      filters: { createdAt, status, search, method, advancedFilter },
      rowsPerPage,
      page,
    } = this.state
    return (
      <div>
        <PaperBlock title="Lista de clientes">
          <Grid container spacing={2}>
            <Grid item lg={3} md={4} sm={12} xs={12}>
              <TextField
                placeholder={isInstitutional ? 'Pesquise pelo email' : 'Pesquise pelo nome do cliente, telefone ou e-mail'}
                variant="outlined"
                fullWidth
                onChange={(e) => this.setFilters(e.target.value, 'search')}
                value={search}
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
            <Grid item lg={2} md={4} sm={12} xs={12}>
              <FormControl variant="outlined" className={classes.formcontrol} fullWidth>
                <InputLabel>Status do cliente</InputLabel>
                <Select
                  label="Status do cliente"
                  variant="outlined"
                  onChange={(e: any) => this.setFilters(e.target.value, 'status')}
                  value={status}
                  MenuProps={{
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'right',
                    },
                    getContentAnchorEl: null,
                  }}
                >
                  <MenuItem value={'true'}>Habilitado</MenuItem>
                  <MenuItem value={'false'}>Desabilitado</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {this.canSeeComponent(['pro', 'enterprise', 'pro-generic', 'start'], plan) && (
              <Grid item lg={2} md={4} sm={12} xs={12}>
                <FormControl variant="outlined" className={classes.formcontrol} fullWidth>
                  <InputLabel>Tipo de cliente</InputLabel>
                  <Select
                    label="Tipo de cliente"
                    variant="outlined"
                    value={advancedFilter}
                    onChange={(ev) => this.setFilters(ev.target.value, 'advancedFilter')}
                    MenuProps={{
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right',
                      },
                      getContentAnchorEl: null,
                    }}
                  >
                    <MenuItem value={undefined}>Todos</MenuItem>
                    <MenuItem value={'mostOrders'}>Compradores frequentes</MenuItem>
                    <MenuItem value={'continuousMedicamentsOrders'}>Compradores de medicamentos de uso contínuo</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid item lg={2} md={4} sm={12} xs={12}>
              <DatePicker date={createdAt} setDate={(value: any) => this.setFilters(value, 'createdAt')} label="Cadastro" />
            </Grid>
          </Grid>
          <Box mt={1}>
            <Grid container spacing={2} alignItems="center">
              {createdAt && (
                <Grid item>
                  <Chip
                    label={`Cadastrado ${moment(createdAt).calendar()}`}
                    onDelete={() => this.setFilters(null, 'createdAt')}
                  />
                </Grid>
              )}
              {advancedFilter && (
                <Grid item>
                  <Chip
                    label={parseAdvancedFilter[advancedFilter]}
                    onDelete={() => this.setFilters(undefined, 'advancedFilter')}
                  />
                </Grid>
              )}
              {status && (
                <Grid item>
                  <Chip label={parseStatus[status]} onDelete={() => this.setFilters('', 'status')} />
                </Grid>
              )}
              {method && (
                <Grid item>
                  <Chip label={`Comprou por ${method}`} onDelete={() => this.setFilters('', 'method')} />
                </Grid>
              )}
              {search && (
                <Grid item>
                  <Chip label={`${search}`} onDelete={() => this.setFilters('', 'search')} />
                </Grid>
              )}
            </Grid>
          </Box>
          <CostumerTable
            customers={customers}
            onDelete={this.onDelete}
            fetching={fetching}
            getCustomers={getCustomers}
            rowsPerPage={rowsPerPage}
            page={page}
            plan={plan}
            handlePage={this.handlePage}
            handleRows={this.handleRows}
            total={total}
          />
        </PaperBlock>
      </div>
    )
  }
}

export default withStyles(style)(CustomersPaper)
