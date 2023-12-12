import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TablePagination,
  Switch,
  Typography,
  withStyles,
  Tabs,
  Tab,
  Grid,
  Input,
  InputAdornment,
  IconButton,
  TextField,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Chip,
} from '@material-ui/core'
import React, { Component } from 'react'
import { Help } from '@material-ui/icons'
import classNames from 'classnames'
import { Link, RouteComponentProps } from 'react-router-dom'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import redAlertIcon from '../../../assets/images/icons/redAlert.svg'

import './tabbar.css'

import style from './style'

import Placeholder from '../../../assets/images/productImageHolder.svg'
import SearchIcon from '../../../assets/images/greySearchIcon.svg'
import SeeMoreDropDown from '../../SeeMoreDropDown'

import { BucketS3 } from '../../../config'
import StorageKey from '../../../services/storageKeys'
import { floatToBRL } from '../../../helpers/moneyFormat'
import { RequestGetAdminNotification, RequestGetProducts, UpdatedProductStatusRequest } from '../../../services/api/interfaces/ApiRequest'

import { ShowcaseConsumer, ShowcaseProvider } from '../../../context/ShowcaseContext'
import { ProductPromotionConsumer, ProductPromotionProvider } from '../../../context/ProductPromotionContext'
import { RequestGetManufacturer, UpdateProductCategory } from '../../../services/api/interfaces/ApiRequest'

import Product from '../../../interfaces/product'
import Control from '../../../interfaces/control'
import Category from '../../../interfaces/category'
import Notification from '../../../interfaces/notification'
import Manufacturer from '../../../interfaces/manufacturer'
import Classification from '../../../interfaces/classification'
import { Autocomplete, AutocompleteInputChangeReason } from '@material-ui/lab'
import { loadStorage, saveStorage } from '../../../services/storage'
import Pagination from '../../../interfaces/pagination'
import DocasIncompleteProductForm from '../../DocasIncompleteProductForm'

type Filter = {
  label: string
  value: string
  tooltipText?: string
}
interface Props extends RouteComponentProps {
  classes: any
  fetching: boolean
  controls: Control[]
  products: Product[]
  virtualProducts: Product[]
  categories: Category[]
  manufacturers: Manufacturer[]
  classifications: Classification[]
  pagination: Pagination | null
  notificationPagination: Pagination | null
  loadControls: () => void
  loadClassifications: () => void
  onDelete: (id: string[]) => Promise<void>
  loadCategories: (data: any) => Promise<void>
  onUpdateCategories: (data: UpdateProductCategory) => void
  loadProducts: (data?: RequestGetProducts) => Promise<void>
  loadVirtualProducts: (data?: RequestGetProducts) => Promise<void>
  loadManufacturers: (data?: RequestGetManufacturer) => Promise<void>
  onUpdateStatus: (data: UpdatedProductStatusRequest) => Promise<void>
  updateDocasProduct: (data: Product) => Promise<void>
  openSnackbar: (message: string, severity?: 'error' | 'info' | 'success' | 'warning') => void
  success: any
  getAdminNotification: (data: RequestGetAdminNotification) => Promise<void>
  notification: Notification | undefined
  mode: any
}

type State = {
  selected: string[]
  popperopen: boolean
  products: Product[]
  virtualProducts: Product[]
  filters: RequestGetProducts
}

class ProductsTable extends Component<Props, State> {
  static defaultProps = {
    fetching: false,
    controls: [],
    products: [],
    virtualProducts: [],
    notification: undefined,
    categories: [],
    manufacturers: [],
    classifications: [],
  }
  state: State = {
    filters: {
      page: 0,
      limit: 20,
      query: '',
      status: null,
      category: [],
      manufacturer: [],
      miscellaneousFilters: [],
    },
    selected: [],
    products: [],
    virtualProducts: [],
    popperopen: false,
  }

  filtersList: Filter[] = [
    {
      label: 'Produtos sem Categoria',
      value: 'without_category',
    },
    {
      label: 'Produtos sem Imagem',
      value: 'without_image',
    },
    {
      label: 'Produtos sem Estoque',
      value: 'without_quantity',
    },
    {
      label: 'Produtos com Estoque',
      value: 'with_quantity',
    },
    {
      label: 'Produtos com PMC desqualificado',
      value: 'low_pmc',
      tooltipText:
        'Este filtro se refere a medicamentos (normalmente fracionados) que estão com PMC pelo menos 3x maior que o valor de venda. Isto pode indicar que os itens estão com valor de fracionado mas com descrição da embalagem inteira. Confira a descrição destes itens com atenção.',
    },
    {
      label: 'Produtos Novos',
      value: 'asc_date',
      tooltipText:
        'São produtos que foram cadastrados recentemente em seu e-commerce, seja via integração pelo seu ERP, ou cadastrados manualmente.',
    },
  ]

  async componentDidMount() {
    const filters = loadStorage<RequestGetProducts>(StorageKey.PRODUCT_KEY)

    if (filters) {
      this.setState(
        (state) => ({
          ...state,
          filters,
        }),
        async () => {
          await this.onLoad({
            ...this.state.filters,
            page: filters.page ? filters.page + 1 : 1,
          })
        }
      )
    } else {
      await this.onLoad()
    }

    await this.onLoadCategories()
    await this.onLoadManufacturers()
    await this.onLoadNotification()
  }

  onLoadNotification = async () => {
    const { getAdminNotification } = this.props
    const data = { type: 'DOCAS' }
    await getAdminNotification(data)
  }

  onLoadManufacturers = async (data?: RequestGetManufacturer) => {
    const { loadManufacturers } = this.props
    await loadManufacturers(data)
  }

  onLoadCategories = async (data?: any) => {
    const { loadCategories } = this.props
    await loadCategories(data)
  }


  clearProductsSelection = async () => {
    await this.setState((state) => ({
      ...state,
      selected: [],
      products: [],
    }))
  }

  onLoad = async (data?: RequestGetProducts) => {
    const { loadProducts, loadVirtualProducts } = this.props

    this.setState(
      (state) => ({
        ...state,
        selected: this.state.selected || [],
        products: this.state.products || [],
        virtualProducts: this.state.virtualProducts || [],
        popperopen: false,
      }),
      async () => {
        if (data && data.status === 'virtual') {
          data.status = null
          await loadVirtualProducts(data)
        } else {
          await loadProducts(data)
        }
      }
    )
  }

  handleProductDelete = async (id: string[]) => {
    const { onDelete } = this.props
    const { selected } = this.state

    if (selected.length > 0) {
      await onDelete(id)
      await this.clearProductsSelection()
      this.setState(
        (state) => ({
          ...state,
          filters: {
            ...state.filters,
            page: state.filters.page,
            limit: state.filters.limit
          },
        }),
      )

      await this.onLoad({
        ...this.state.filters,
      })
    }
  }

  handleUpdateProductCategory = async (category: string[]) => {
    const { onUpdateCategories } = this.props
    const { products } = this.state

    if (products.length > 0) {
      onUpdateCategories({ category, product: products })
      await this.clearProductsSelection()
      this.setState(
        (state) => ({
          ...state,
          filters: {
            ...state.filters,
            page: state.filters.page,
            limit: state.filters.limit
          },
        }),
      )

      await this.onLoad({
        ...this.state.filters,
      })
    }
  }

  setPopperOpen = (popperopen: boolean) => {
    this.setState((state) => ({
      ...state,
      popperopen,
    }))
  }

  selectAll = () => {
    const { selected } = this.state
    const { products } = this.props

    const allProductsSelected = products.every((product) => selected.includes(product._id as string))

    let newProducts = this.state.products.slice()

    if (allProductsSelected === true) {
      products.forEach((product) => {
        if (product._id && selected.includes(product._id)) {
          const index = selected.indexOf(product._id)
          selected.splice(index, 1)
          newProducts = newProducts.filter((p) => p._id !== product._id)
        }
      })
    } else if (allProductsSelected === false) {
      products.forEach((product) => {
        if (product._id && !selected.includes(product._id)) {
          selected.push(product._id)
          newProducts = newProducts.concat(product)
        }
      })
    }

    this.setState((state) => ({
      ...state,
      selected,
      products: newProducts,
    }))
  }

  selectOne = (productId: string) => {
    const { selected, products } = this.state

    const index = selected.findIndex((id) => id === productId)

    let newSelected
    let newProducts

    if (index !== -1) {
      newSelected = selected.filter((id) => id !== productId)
    } else {
      newSelected = [...selected, productId]
    }

    const productIndex = products.findIndex((product) => product._id && product._id === productId)

    if (productIndex !== -1) {
      newProducts = [...products.slice(0, productIndex), ...products.slice(productIndex + 1)]
    } else {
      const newProduct = this.props.products.find((_product) => _product._id && _product._id === productId)
      if (newProduct) {
        newProducts = [...products, newProduct]
      } else {
        newProducts = products
      }
    }

    this.setState({
      selected: newSelected,
      products: newProducts,
    })
  }

  handleChangeFilters = (field: string, value: number | string | string[]) => {
    this.setState(
      (state) => ({
        ...state,
        filters: {
          ...state.filters,
          page: 0,
          limit: 20,
          [field]: value,
        },
      }),
      async () => {
        saveStorage(StorageKey.PRODUCT_KEY, this.state.filters)

        await this.onLoad({
          ...this.state.filters,
          page: 1,
        })
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
        saveStorage(StorageKey.PRODUCT_KEY, this.state.filters)

        await this.onLoad({
          ...this.state.filters,
          page: page + 1,
        })
      }
    )
  }

  handleChangeRowsPerPage = (event: any) => {
    const limit = event.target.value

    this.setState(
      (state) => ({
        ...state,
        filters: {
          ...state.filters,
          page: 0,
          limit: parseInt(limit, 10),
        },
      }),
      async () => {
        saveStorage(StorageKey.PRODUCT_KEY, this.state.filters)

        await this.onLoad({
          ...this.state.filters,
          page: 1,
        })
      }
    )
  }

  clearFilters = (field: string, data: string | string[] | null) => {
    const value = data instanceof Array ? [] : data !== null ? '' : null

    this.setState(
      (state) => ({
        ...state,
        filters: {
          ...state.filters,
          page: 0,
          limit: 20,
          [field]: value,
        },
      }),
      async () => {
        saveStorage(StorageKey.PRODUCT_KEY, this.state.filters)

        await this.onLoad({
          ...this.state.filters,
          page: 1,
        })
      }
    )
  }

  convertFilterTextValue = (field: string, value?: any) => {
    const {
      filters: { miscellaneousFilters, category, manufacturer },
    } = this.state
    const { manufacturers, categories } = this.props

    switch (field) {
      case 'miscellaneousFilters':
        return miscellaneousFilters.map((item) => {
          const filterItem = this.filtersList.find((filter) => filter.value === item) as Filter
          return filterItem.label.concat(', ')
        })

      case 'category':
        return categories
          .filter((_category) => _category._id && category.includes(_category._id))
          .map((cat) => cat.name.concat(', '))

      case 'manufacturer':
        return manufacturers
          .filter((_manufacturer) => _manufacturer._id && manufacturer.includes(_manufacturer._id))
          .map((manufac) => manufac.name.concat(', '))

      default:
        return value
    }
  }

  handleUpdateProductStatus = async (status: boolean = true, productId?: string) => {
    const { onUpdateStatus } = this.props
    const product = this.state.selected

    if (!productId && product.length > 0) {
      await onUpdateStatus({ product, status })
    } else {
      if (productId) await onUpdateStatus({ product: [productId], status })
    }

    await this.clearProductsSelection()

    this.setState(
      (state) => ({
        ...state,
        filters: {
          ...state.filters,
          page: state.filters.page,
          limit: state.filters.limit
        },
      }),
    )

    await this.onLoad({
      ...this.state.filters,
    })
  }

  productFilters = () => {
    const { manufacturers, categories, classes } = this.props
    const { filters } = this.state

    return (
      <Box mt={4}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
            <Input
              fullWidth
              name="query"
              autoComplete="off"
              value={filters.query}
              placeholder="Filtre por nome ou EAN do produto"
              startAdornment={
                <InputAdornment position="start">
                  <IconButton>
                    <img src={SearchIcon} alt="search-product" />
                  </IconButton>
                </InputAdornment>
              }
              onChange={({ target }) => this.handleChangeFilters('query', target.value)}
            />
          </Grid>
          <Grid item lg={3} md={3} xs={12}>
            <Autocomplete
              options={manufacturers}
              getOptionLabel={(option: Manufacturer) => option.name}
              onChange={(ev: any, manufacturer: Manufacturer | null) => {
                if (manufacturer && manufacturer._id) {
                  if (!filters.manufacturer.includes(manufacturer._id)) {
                    filters.manufacturer.push(manufacturer._id)

                    this.handleChangeFilters('manufacturer', filters.manufacturer)
                  }
                }
              }}
              onInputChange={async (e: React.ChangeEvent<{}>, value: string, reason: AutocompleteInputChangeReason) => {
                if (reason.includes('input')) {
                  await this.onLoadManufacturers({ name: value.trimEnd() })
                }
              }}
              clearOnBlur={false}
              renderInput={(params) => (
                <TextField
                  {...params}
                  className={classes.autocomplete}
                  fullWidth
                  variant="outlined"
                  name="manufacturer"
                  placeholder="Fabricante"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {false ? <CircularProgress color="primary" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
            <Autocomplete
              options={categories}
              getOptionLabel={(option: Category) => option.name}
              onInputChange={async (e: React.ChangeEvent<{}>, value: string, reason: AutocompleteInputChangeReason) => {
                if (reason.includes('input')) {
                  await this.onLoadCategories({ name: value })
                }
              }}
              onChange={(ev: any, category: Category | null) => {
                if (category && category._id) {
                  if (!filters.category.includes(category._id)) {
                    filters.category.push(category._id)

                    this.handleChangeFilters('category', filters.category)
                  }
                }
              }}
              clearOnBlur={false}
              renderInput={(params) => (
                <TextField
                  {...params}
                  className={classes.autocomplete}
                  fullWidth
                  variant="outlined"
                  name="category"
                  placeholder="Categoria"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {false ? <CircularProgress color="primary" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="miscellaneos-search">Filtros diversos</InputLabel>
              <Select
                fullWidth
                variant="outlined"
                label="Filtros diversos"
                name="miscellaneousFilters"
                labelId="miscellaneos-search"
                value={filters.miscellaneousFilters}
                onChange={({ target }) => {
                  const miscellaneousFilters = filters.miscellaneousFilters

                  if (!miscellaneousFilters.includes(String(target.value).toString())) {
                    miscellaneousFilters.push(String(target.value).toString())

                    this.handleChangeFilters('miscellaneousFilters', miscellaneousFilters)
                  }
                }}
                MenuProps={{
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right',
                  },
                  getContentAnchorEl: null,
                }}
              >
                {this.filtersList.map((item: Filter, idx: number) => (
                  <MenuItem key={idx} value={item.value}>
                    {item.tooltipText ? (
                      <Tooltip title={item.tooltipText}>
                        <Box display="flex" flexDirection="row" alignItems="center">
                          {item.label}
                          <Help className={classes.iconhelp} />
                        </Box>
                      </Tooltip>
                    ) : (
                      <>{item.label}</>
                    )}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Box>
          <Grid container spacing={2}>
            {Object.keys(filters)
              .filter((k) => filters[k] && !k.includes('status') && filters[k].length > 0)
              .map((key) => {
                return (
                  <Grid item key={key}>
                    <Chip
                      label={this.convertFilterTextValue(key, filters[key])}
                      onDelete={() => this.clearFilters(key, filters[key])}
                    />
                  </Grid>
                )
              })}
          </Grid>
        </Box>
      </Box>
    )
  }

  productTabFilter = () => {
    const { classes, notificationPagination } = this.props
    const { filters } = this.state

    return (
      <div className={filters.status === 'virtual' ? 'products_table_tabbar' : ''}>
        <Tabs
          value={filters.status}
          indicatorColor="primary"
          onChange={(event, value) => this.handleChangeFilters('status', value)}
          className={classes.tabs}
          classes={{
            indicator: classes.indicator,
          }}
        >
          <Tab label="Todos" value={null} />
          <Tab label="Publicados" value="true" />
          <Tab label="Não Publicados" value="false" />
          {notificationPagination && notificationPagination.total > 0 && (
            <Tab
              label={
                <span className={classes.virtualTab}>
                  Virtual
                  <span className={classes.virtualTabAlertIcon}>
                    <img src={redAlertIcon} alt="Alert" />
                  </span>
                </span>
              }
              value={'virtual'}
              style={{ borderColor: 'red' }}
            />
          )}
        </Tabs>
      </div>
    )
  }
  EnhancedTableHead = () => {
    const { classes, products = [] } = this.props
    const { selected } = this.state

    let allProductsSelected = false

    if (selected.length > 0) {
      allProductsSelected = products.every((product) => selected.includes(product._id as string))
    }
    return (
      <React.Fragment>
        <TableHead className={classNames(classes.tablehead, selected.length > 0 ? classes.invisible : classes.visible)}>
          <TableRow
            classes={{
              root: classes.rowroot,
            }}
          >
            <TableCell padding="checkbox" classes={{ root: classes.cellrowroot }}>
              <Checkbox checked={allProductsSelected} onChange={this.selectAll} />
            </TableCell>
            <TableCell align="center" classes={{ head: classes.headcell }}>
              <Typography className={classes.tableHeadTitle}>Produto</Typography>
            </TableCell>
            <TableCell align="center" classes={{ head: classes.headcell }}>
              <Typography className={classes.tableHeadTitle}>Preço</Typography>
            </TableCell>
            <TableCell classes={{ head: classes.headcell }}>
              <Typography className={classes.tableHeadTitle}>Estoque</Typography>
            </TableCell>
            <TableCell classes={{ head: classes.headcell }}>
              <Typography className={classes.tableHeadTitle}>Categoria</Typography>
            </TableCell>
            <TableCell classes={{ head: classes.headcell }} align="center">
              <Typography className={classes.tableHeadTitle}>Status</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
      </React.Fragment>
    )
  }

  _renderTableBody = () => {
    const { classes, products = [] } = this.props
    const { selected } = this.state

    return products.map(product => {
      const { image } = product

      const backgroundImage = image ? new URL(image.key, BucketS3).href : Placeholder

      return (
        <TableRow
          key={product._id}
          classes={{
            root: product._id && selected.includes(product._id) ? classes.rowrootselected : classes.rowroot,
          }}
        >
          <TableCell
            padding="checkbox"
            classes={{
              root: classes.cellrowroot,
            }}
          >
            <Checkbox
              onChange={() => {
                if (product._id) this.selectOne(product._id)
              }}
              checked={product._id ? selected.includes(product._id) : false}
            />
          </TableCell>
          <TableCell
            classes={{
              root: classes.row,
            }}
          >
            <div className={classes.productrow}>
              <div
                className={classes.image}
                style={{
                  backgroundImage: `url("${backgroundImage}")`
                }}
              />
              <div className={classes.productcolumn}>
                <Link className={classes.text} to={`/products/${product._id}`}>
                  {product.name}
                  <ChevronRightIcon className={classes.gotoicon} />
                </Link>
                <Typography className={classes.text}>( {product.EAN} )</Typography>
              </div>
            </div>
          </TableCell>
          <TableCell
            align="center"
            classes={{
              root: classes.row,
            }}
          >
            <Typography className={classes.text}>{floatToBRL(product?.price || 0)}</Typography>
          </TableCell>
          <TableCell
            classes={{
              root: classes.row,
            }}
          >
            <Typography className={classes.text}>{product.quantity}</Typography>
          </TableCell>
          <TableCell
            classes={{
              root: classes.row,
            }}
          >
            <Typography className={classes.text}>
              {product.category && product.category.length > 0
                ? product.category.map((category: Category) => category.name).join(' , ')
                : 'Nenhuma categoria'}
            </Typography>
          </TableCell>
          <TableCell
            classes={{
              root: classes.row,
            }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <div className={classNames(classes.statuscontainer, classes[`status${product.status.toString()}`])}>
              <Typography className={classes.statustext} noWrap>
                {product.status ? 'Publicado' : 'Não Publicado'}
              </Typography>
              <Switch
                color="default"
                checked={product.status}
                onClick={async () => await this.handleUpdateProductStatus(!product.status, product._id)}
              />
            </div>
          </TableCell>
        </TableRow>
      )
    })
  }

  _renderDocasProductsTableBody = () => {
    const { classes, mode, virtualProducts = [], updateDocasProduct, success, openSnackbar } = this.props

    if (virtualProducts && virtualProducts.length > 0) {
      return (
        <DocasIncompleteProductForm
          classes={classes}
          mode={mode}
          products={virtualProducts}
          onSave={updateDocasProduct}
          success={success}
          openSnackbar={openSnackbar}
        />
      )
    }
  }

  render() {
    const { classes, history, fetching, pagination } = this.props
    const { filters, popperopen, selected, products } = this.state

    let allProductsSelected = false

    if (selected.length > 0) {
      allProductsSelected = this.props.products.every((product) => selected.includes(product._id as string))
    }
    return (
      <Box>
        {this.productTabFilter()}
        {this.productFilters()}
        {selected.length > 0 && (
          <Box display="flex" mt={2}>
            <ButtonGroup className={classes.buttongroup}>
              <Button className={classes.button}>
                <Checkbox checked={allProductsSelected} onChange={() => this.selectAll()} className={classes.checkbox} />
                {selected.length} na seleção
              </Button>
              <Button
                className={classes.button}
                onClick={() => {
                  history.push('/product/editor', { products })
                }}
              >
                Editar produtos
              </Button>
              <Button className={classes.button}>
                <ShowcaseProvider>
                  <ProductPromotionProvider>
                    <ProductPromotionConsumer>
                      {({ requestAddProductPromotions }) => (
                        <ShowcaseConsumer>
                          {({ addProducts }) => (
                            <SeeMoreDropDown
                              {...this.props}
                              open={popperopen}
                              history={history}
                              selected={selected}
                              fetching={fetching}
                              addProducts={addProducts}
                              getProducts={this.onLoad}
                              setOpen={this.setPopperOpen}
                              onDelete={this.handleProductDelete}
                              addPromotions={requestAddProductPromotions}
                              onUpdateStatus={this.handleUpdateProductStatus}
                              updateProductCategory={this.handleUpdateProductCategory}
                            />
                          )}
                        </ShowcaseConsumer>
                      )}
                    </ProductPromotionConsumer>
                  </ProductPromotionProvider>
                </ShowcaseProvider>
              </Button>
            </ButtonGroup>
          </Box>
        )}
        <TableContainer>
          <Table>
            {filters.status !== 'virtual' && (
              <>
                {this.EnhancedTableHead()}
                <TableBody>{this._renderTableBody()}</TableBody>
              </>
            )}
          </Table>
        </TableContainer>
        {filters.status === 'virtual' && this._renderDocasProductsTableBody()}
        {pagination !== null && (
          <TablePagination
            component="div"
            count={pagination.total}
            labelRowsPerPage="Linhas"
            page={filters.page || 0}
            rowsPerPage={filters.limit || 20}
            rowsPerPageOptions={[5, 15, 20, 30]}
            onChangePage={this.handleChangePage}
            labelDisplayedRows={(paginationInfo) => `Página ${paginationInfo.page + 1} itens ${paginationInfo.count}`}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
            classes={{
              actions: classes.paginationarrows,
            }}
          />
        )}
      </Box>
    )
  }
}

export default withStyles(style)(ProductsTable)
