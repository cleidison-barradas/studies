import {
  Button,
  Checkbox,
  Collapse,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  withStyles,
  ButtonGroup,
  Menu,
  MenuItem,
} from '@material-ui/core'
import classNames from 'classnames'
import React, { Component } from 'react'
import { ExpandLess, ExpandMore } from '@material-ui/icons'
import EditIcon from '@material-ui/icons/Edit'
// Interfaces
import Category from '../../../interfaces/category'
import Pagination from '../../../interfaces/pagination'
import ArrowDown from '../../../assets/images/blackArrowDown.svg'
import style from './style'
import './dropdownStyle.css'

type Props = {
  history: any
  categories: Category[]
  pagination: Pagination
  onDelete: ({ ids }: IDelete) => void
  loadCategories: (data?: any) => Promise<void>
  onEditing: ({ ids, status }: IEditing) => void
  classes: any
}

interface ILoadCategory {
  page: number
  limit: number
  query: string
}

interface IEditing {
  ids: Category['_id'][]
  status: any
}
interface IDelete {
  ids: Category['_id'][]
}

type State = {
  selected: Category['_id'][]
  categorys: Category[]
  collapsed: Category[]
  filters: ILoadCategory
  menuAnchorEl: HTMLElement | null
}

class CategoryTable extends Component<Props, State> {
  static defaultProps = {
    categories: [],
    pagination: {
      pages: 0,
      limit: 20,
      total: 0,
      currentPage: 0,
    },
  }

  state: State = {
    selected: [],
    categorys: [],
    collapsed: [],
    filters: {
      query: '',
      page: 0,
      limit: 20,
    },
    menuAnchorEl: null,
  }

  openMenuOptions = Boolean(this.state.menuAnchorEl)

  async componentDidMount() {
    await this.onLoadCategories()
  }

  onLoadCategories = async (data?: any) => {
    const { loadCategories } = this.props
    const { filters } = this.state
    const requestData = data || filters
    this.setState(
      (state) => ({
        ...state,
        categories: [],
      }),
      async () => {
        await loadCategories(requestData)
      }
    )
  }

  handleChangePage = (ev: any, page: number) => {
    this.setState(
      (state) => ({
        ...state,
        filters: {
          ...state.filters,
          page,
        },
      }),
      async () => {
        await this.onLoadCategories({
          ...this.state.filters,
          page: page + 1
        })
      }
    )
  }

  handleChangeRowsPerPage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10)

    this.setState(
      (state) => ({
        ...state,
        filters: {
          ...state.filters,
          page: 0,
          limit: newRowsPerPage,
        },
      }),
      async () => {
        await this.onLoadCategories({
          ...this.state.filters,
          page: 1
        })
      }
    )
  }

  select = (id: Category['_id']) => {
    const { selected } = this.state

    if (selected.includes(id)) {
      const index = selected.findIndex((_id) => _id === id)
      selected.splice(index, 1)
    } else {
      selected.push(id)
    }

    this.setState((state: any) => ({
      ...state,
      selected,
    }))
  }

  selectAll = () => {
    const { selected } = this.state
    const { categories } = this.props

    if (selected.length === categories.length) {
      this.setState((state: any) => ({
        ...state,
        selected: [],
      }))
    } else {
      const ids = categories.map((category) => category._id)

      this.setState((state: any) => ({
        ...state,
        selected: [...ids],
      }))
    }
  }

  expand = (category: Category) => {
    const { collapsed } = this.state

    if (collapsed.includes(category)) {
      const filtered = collapsed.filter((value) => value._id !== category._id)
      this.setState((state: any) => ({
        ...state,
        collapsed: filtered,
      }))
    } else {
      collapsed.push(category)

      this.setState((state: any) => ({
        ...state,
        collapsed,
      }))
    }
  }

  selectedAllFields = () => {
    const { categories } = this.props
    const childs = categories.map((category) => {
      if (category) {
        return category
      } else {
        return ''
      }
    })

    return childs.length
  }

  handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({ ...this.state, menuAnchorEl: event.currentTarget })
  }

  handleCloseMenu = () => {
    this.setState({ ...this.state, menuAnchorEl: null })
  }

  EnhancedTableHead = () => {
    const { selected } = this.state
    const { classes } = this.props

    return (
      <React.Fragment>
        <TableHead>
          <TableRow
            classes={{
              root: classes.rowroot,
            }}
          >
            {selected.length > 0 ? (
              <TableCell
                classes={{
                  root: classes.cellroot,
                }}
              >
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <ButtonGroup className={classes.buttongroup}>
                      <Button variant="outlined">
                        <Checkbox
                          checked={selected.length === this.selectedAllFields()}
                          onChange={this.selectAll}
                          classes={{
                            root: classes.checkbox,
                          }}
                        />

                        <Typography
                          className={classes.selectbtntext}
                          onClick={this.selectAll}
                          classes={{
                            root: classes.checkbox,
                          }}
                        >
                          {selected.length} na seleção
                        </Typography>
                      </Button>

                      <Button
                        id="button-options"
                        variant="outlined"
                        className={classes.button}
                        aria-controls={this.openMenuOptions ? 'button-options' : undefined}
                        aria-haspopup="true"
                        aria-expanded={this.openMenuOptions ? 'true' : undefined}
                        onClick={this.handleOpenMenu}
                      >
                        <Typography className={classes.buttontext}>
                          Opções <img src={ArrowDown} alt="" />
                        </Typography>
                      </Button>
                    </ButtonGroup>
                  </Grid>
                </Grid>
              </TableCell>
            ) : (
              <TableCell
                classes={{
                  root: classes.cellroot,
                }}
              >
                <Button>
                  <Checkbox
                    checked={selected.length === this.selectedAllFields()}
                    onChange={this.selectAll}
                    classes={{
                      root: classes.checkbox,
                    }}
                  />
                  <Typography className={classes.selectbtntext} />
                </Button>
                &nbsp;Nome
              </TableCell>
            )}
            <TableCell align="left" classes={{ root: classes.cellroot }}>
              Tipo
            </TableCell>
            <TableCell align="left" classes={{ root: classes.cellroot }}>
              Status
            </TableCell>
            <TableCell align="left" classes={{ root: classes.cellroot }}>
              Editar
            </TableCell>
            <TableCell align="left" classes={{ root: classes.cellroot }}>
              SubCategorias
            </TableCell>
          </TableRow>
        </TableHead>
      </React.Fragment>
    )
  }

  treeTable = (category: Category) => {
    const { classes } = this.props
    const { collapsed, selected } = this.state

    if (category.subCategories && category.subCategories?.length > 0) {
      return category.subCategories?.map((subcategory) => (
        <React.Fragment key={subcategory._id}>
          <TableRow
            classes={{
              root: classes.rowroot,
            }}
          >
            <TableCell
              className={classes.childcell}
              classes={{
                root: classes.cellroot,
                sizeSmall: classes.sizesmall,
              }}
            >
              <Collapse in={collapsed.includes(category)} timeout="auto" unmountOnExit>
                <Grid container alignItems="center">
                  <Checkbox
                    style={{ paddingLeft: 25 }}
                    onChange={() => this.select(subcategory._id)}
                    checked={selected.includes(subcategory._id)}
                  />
                  <Typography>{subcategory.name}</Typography>
                </Grid>
              </Collapse>
            </TableCell>
            <TableCell
              classes={{
                root: classes.cellroot,
                sizeSmall: classes.sizesmall,
              }}
            />

            <TableCell
              classes={{
                root: classes.cellroot,
                sizeSmall: classes.sizesmall,
              }}
            />

            <TableCell
              classes={{
                root: classes.cellroot,
                sizeSmall: classes.sizesmall,
              }}
            />

            <TableCell
              classes={{
                root: classes.cellroot,
                sizeSmall: classes.sizesmall,
              }}
            />
          </TableRow>
        </React.Fragment>
      ))
    }
  }
  _renderTableBody = () => {
    const { categories, classes } = this.props
    const { selected, collapsed } = this.state

    if (categories.length > 0) {
      return categories.map((category) => (
        <React.Fragment key={category._id}>
          <TableRow
            classes={{
              root: classes.rowroot,
            }}
          >
            <TableCell
              align="left"
              classes={{
                root: classes.cellroot,
                sizeSmall: classes.sizesmall,
              }}
            >
              <Grid container alignItems="center">
                <Checkbox
                  style={{ paddingLeft: 20 }}
                  onChange={() => this.select(category._id)}
                  checked={selected.includes(category._id)}
                />
                <Typography>{category.name}</Typography>
              </Grid>
            </TableCell>
            <TableCell
              align="left"
              classes={{
                root: classes.cellroot,
                sizeSmall: classes.sizesmall,
              }}
            >
              <Grid container alignItems="center">
                <Typography>{category.parentId === '0' ? 'Categoria principal' : 'Subcategoria'}</Typography>
              </Grid>
            </TableCell>
            <TableCell
              className={classes.statuscell}
              classes={{
                root: classes.cellroot,
                sizeSmall: classes.sizesmall,
              }}
              align="left"
            >
              <div className={classNames(classes.statuscontainer, category.status ? classes.statustrue : classes.statusfalse)}>
                <Typography className={classes.statustext} noWrap>
                  {category.status ? 'Ativada' : 'Desativada'}
                </Typography>
              </div>
            </TableCell>
            <TableCell
              classes={{
                root: classes.cellroot,
                sizeSmall: classes.sizesmall,
              }}
              align="left"
            >
              <IconButton onClick={() => this.props.history.push(`category/${category._id}`)}>
                <EditIcon />
              </IconButton>
            </TableCell>
            <TableCell
              align="left"
              classes={{
                root: classes.cellroot,
                sizeSmall: classes.sizesmall,
              }}
            >
              {category.subCategories && category.parentId === '0' && category.subCategories[0] && (
                <IconButton onClick={() => this.expand(category)}>
                  {collapsed.includes(category) ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              )}
            </TableCell>
          </TableRow>
          {this.treeTable(category)}
        </React.Fragment>
      ))
    }
  }

  render() {
    const { pagination, classes, onDelete, onEditing } = this.props
    const {
      filters: { page, limit },
      selected,
    } = this.state
    const open = this.state.menuAnchorEl !== null

    return (
      <React.Fragment>
        <TableContainer>
          <Table classes={{ root: classes.tableRoot }} size="small">
            <this.EnhancedTableHead />
            <TableBody>{this._renderTableBody()}</TableBody>
          </Table>
          <TablePagination
            component="div"
            labelRowsPerPage="Linhas"
            count={pagination?.total}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 15, 20, 30, 50]}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </TableContainer>
        <Menu
          id="menu-options"
          anchorEl={this.state.menuAnchorEl}
          open={open}
          onClose={this.handleCloseMenu}
          MenuListProps={{
            'aria-labelledby': 'button-options',
          }}
          elevation={0}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          classes={{
            paper: classes.menuBox,
          }}
        >
          <MenuItem
            className="DropdownMenuItem"
            onClick={({ target }) => {
              this.handleCloseMenu()
              onEditing({ ids: selected, status: true })
              setTimeout(() => {
                this.setState((state: any) => ({
                  ...state,
                  selected: [],
                }))
              }, 500)
            }}
          >
            Definir como ativa
          </MenuItem>
          <MenuItem
            className="DropdownMenuItem"
            onClick={({ target }) => {
              this.handleCloseMenu()
              onEditing({ ids: selected, status: false })
              setTimeout(() => {
                this.setState((state: any) => ({
                  ...state,
                  selected: [],
                }))
              }, 500)
            }}
          >
            Definir como desativada
          </MenuItem>

          <MenuItem
            className="DropdownMenuItem"
            onClick={() => {
              this.handleCloseMenu()
              onDelete({ ids: selected })
              setTimeout(() => {
                this.setState((state: any) => ({
                  ...state,
                  selected: [],
                }))
              }, 500)
            }}
          >
            Excluir
          </MenuItem>
        </Menu>
      </React.Fragment>
    )
  }
}

export default withStyles(style)(CategoryTable)