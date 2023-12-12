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
} from '@material-ui/core'
import { ArrowRight, Delete } from '@material-ui/icons'
import moment from 'moment'
import { Link } from 'react-router-dom'
import Customer from '../../../interfaces/customer'
import CustomConfirmDialog from '../../CustomConfirmDialog'
import LoadingContainer from '../../LoadingContainer'
import style from './style'
import Plan from '../../../interfaces/plan'
import CustomComponent from '../../CustomComponent'

type Props = {
  classes: any
  customers: Customer[]
  onDelete: (_id: Customer['_id'] | Customer['_id'][]) => void
  getCustomers: (...args: any) => void
  fetching: any
  page: number
  plan: Plan
  rowsPerPage: number
  handlePage: (...args: any) => void
  handleRows: (...args: any) => void
  total: number
}

type State = {
  selected: Customer['_id'][]
  dialog: {
    open: boolean
    text: string
    onAccept: any
    onDecline: any
  }
}

class CostumerTable extends CustomComponent<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      selected: [],
      dialog: {
        open: false,
        text: '',
        onAccept: (...args: any) => '',
        onDecline: (...args: any) => '',
      },
    }
    this.CustomTableHead = this.CustomTableHead.bind(this)
    this.select = this.select.bind(this)
    this.selectAll = this.selectAll.bind(this)
    this.unselectAll = this.unselectAll.bind(this)
    this.unSelectMany = this.unSelectMany.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }

  select(_id: Customer['_id']) {
    if (this.state.selected.includes(_id)) {
      const selected = this.state.selected.filter((value: Customer['_id']) => value !== _id)
      this.setState({
        selected,
      })
    } else {
      const selected = this.state.selected
      selected.push(_id)
      this.setState({
        selected,
      })
    }
  }

  unSelectMany(_id: Customer['_id'][]) {
    const selected = this.state.selected.filter((value: Customer['_id']) => !_id.includes(value))
    this.setState({
      ...this.state,
      selected,
    })
  }

  selectAll() {
    if (this.state.selected.length === this.props.customers.length) {
      this.setState({
        ...this.state,
        selected: [],
      })
    } else {
      const selected = this.props.customers.map((value: Customer) => value._id)
      this.setState({
        selected,
      })
    }
  }

  unselectAll() {
    this.setState({
      ...this.state,
      selected: [],
    })
  }

  closeDialog(cb?: any) {
    this.setState(
      {
        ...this.state,
        dialog: {
          ...this.state.dialog,
          open: false,
        },
      },
      cb
    )
  }

  onDelete(customer: any) {
    const { onDelete } = this.props

    if (!customer.length) {
      this.setState({
        ...this.state,
        dialog: {
          onAccept: () => {
            onDelete(customer['_id'])
            this.closeDialog(this.unselectAll())
          },
          onDecline: () => this.closeDialog(),
          open: true,
          text: `Deseja remover o usuario ${customer.full_name}?`,
        },
      })
    } else {
      this.setState({
        ...this.state,
        dialog: {
          onAccept: () => {
            onDelete(customer)
            this.closeDialog(this.unselectAll())
          },
          onDecline: () => this.closeDialog(),
          open: true,
          text: `Deseja remover ${customer.length} usuarios?`,
        },
      })
    }
  }

  CustomTableHead() {
    const { selected } = this.state
    const { classes, customers, plan } = this.props

    const headItems = ['Nome', 'Email', 'Telefone', 'Status', 'Cadastro']

    return (
      <>
        <TableHead>
          <TableRow>
            <TableCell
              padding="checkbox"
              classes={{
                root: classes.tablecellroot,
              }}
            >
              <Checkbox checked={selected.length === customers.length} onChange={this.selectAll} />
            </TableCell>
            {(plan.rule === 'institutional' ? ['Email'] : headItems).map((headItem) => (
              <TableCell key={headItem}>{headItem}</TableCell>
            ))}
            <TableCell align="center">Excluir</TableCell>
          </TableRow>
        </TableHead>
      </>
    )
  }

  render() {
    const { classes, customers, fetching, rowsPerPage, page, handlePage, handleRows, total, plan } = this.props
    const { selected, dialog } = this.state
    return (
      <>
        {fetching ? (
          <Box mt={2}>
            <LoadingContainer />
          </Box>
        ) : (
          <TableContainer>
            {selected.length > 0 && customers.length > 0 ? (
              <Box mt={2}>
                <Grid container spacing={2} style={{ width: '100%' }} alignItems="center">
                  <Grid item>
                    <Button
                      variant="outlined"
                      classes={{
                        root: classes.checkboxbtn,
                      }}
                    >
                      <Checkbox
                        classes={{
                          root: classes.checkbox,
                        }}
                        checked={true}
                        onChange={this.unselectAll}
                      />
                      {`${selected.length} na seleção`}
                    </Button>
                  </Grid>
                  {/*
                                                <Grid item>
                                                    <Button variant="contained" color="primary" >
                                                        exportar
                                                    </Button>
                                                </Grid>
                                                    */}
                  <Grid item>
                    <Button
                      variant="contained"
                      classes={{
                        root: classes.deletebtn,
                      }}
                      onClick={() => {
                        this.onDelete(selected)
                      }}
                    >
                      excluir
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              ''
            )}
            <Table style={{ marginTop: selected.length > 0 ? 0 : '' }}>
              {selected.length === 0 ? <this.CustomTableHead /> : ''}
              <TableBody>
                {customers.map((value: Customer) => (
                  <TableRow key={value._id}>
                    <TableCell
                      padding="checkbox"
                      classes={{
                        root: classes.tablecellroot,
                      }}
                    >
                      <Checkbox checked={selected.includes(value._id)} onChange={() => this.select(value._id)} />
                    </TableCell>
                    {this.canSeeComponent(['pro', 'enterprise', 'pro-generic', 'start'], plan) && (
                      <TableCell
                        classes={{
                          root: classes.tablecellroot,
                        }}
                      >
                        <Link to={`/customers/${value._id}`} className={classes.link}>
                          {value.firstname} {value.lastname}
                          <ArrowRight />
                        </Link>
                      </TableCell>
                    )}
                    <TableCell
                      classes={{
                        root: classes.tablecellroot,
                      }}
                    >
                      {value.email}
                    </TableCell>
                    {this.canSeeComponent(['pro', 'enterprise', 'pro-generic', 'start'], plan) && (
                      <>
                        <TableCell
                          classes={{
                            root: classes.tablecellroot,
                          }}
                        >
                          {value.phone}
                        </TableCell>
                        <TableCell
                          classes={{
                            root: classes.tablecellroot,
                          }}
                        >
                          {value.status ? 'Habilitado' : 'Desabilitado'}
                        </TableCell>
                        <TableCell
                          classes={{
                            root: classes.tablecellroot,
                          }}
                        >
                          {moment(value.createdAt).calendar()}
                        </TableCell>
                      </>
                    )}
                    <TableCell
                      align="center"
                      classes={{
                        root: classes.tablecellroot,
                      }}
                    >
                      <IconButton onClick={() => this.onDelete(value)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <CustomConfirmDialog
          open={dialog.open}
          onAccept={dialog.onAccept}
          onDecline={dialog.onDecline}
          onClose={dialog.onDecline}
          text={dialog.text}
          title={'Confirmação'}
        />
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          labelRowsPerPage="Linhas"
          page={page}
          onChangePage={handlePage}
          onChangeRowsPerPage={handleRows}
        />
      </>
    )
  }
}

export default withStyles(style)(CostumerTable)
