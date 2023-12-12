import {
  Avatar,
  Box,
  Checkbox,
  CircularProgress,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  withStyles,
} from '@material-ui/core'
import React, { Component } from 'react'
import { floatToBRL } from '../../../helpers/moneyFormat'
import Category from '../../../interfaces/category'
import Manufacturer from '../../../interfaces/manufacturer'
import Product from '../../../interfaces/product'
import SearchIcon from '../../../assets/images/greySearchIcon.svg'
import styles from './style'
import { BucketS3 } from '../../../config'
import { Autocomplete } from '@material-ui/lab'
import { Field, FieldProps } from 'formik'
import { RequestGetManufacturer, RequestGetProducts } from '../../../services/api/interfaces/ApiRequest'
import { ManufacturerConsumer } from '../../../context/ManufacturerContext'
import { CategoryConsumer } from '../../../context/CategoryContext'
import ShowcaseProduct from '../../../interfaces/showcaseProduct'
import { ProductConsumer } from '../../../context/ProductContext'
import { debounce } from 'lodash'

type Props = {
  classes: any
  getProducts: (data?: RequestGetProducts) => Promise<void>
  getCategorys: (data?: any, id?: any) => Promise<void>
  getManufacturers: (payload?: RequestGetManufacturer) => Promise<void>
}

interface State extends RequestGetProducts {
  page: number
  rowsPerPage: number
}

class ShowcaseProductsTable extends Component<Props, State> {
  state: State = {
    page: 0,
    rowsPerPage: 5,
    query: '',
    manufacturer: [],
    category: [],
    miscellaneousFilters: [],
    name: '',
    status: true,
  }

  handleChangePage = (event: any, newPage: number) => {
    this.setState(
      {
        ...this.state,
        page: newPage,
      },
      () => this.load()
    )
  }

  load = async () => {
    const { getProducts } = this.props
    const { page, rowsPerPage: limit, ...state } = this.state

    await getProducts({
      page: page + 1,
      limit,
      ...state,
    })
  }

  onChangeField = debounce((field: any, value: any) => {
    this.setState(
      {
        ...this.state,
        [field]: value,
      },
      () => {
        this.load()
      }
    )
  }, 300)

  async componentDidMount() {
    const { getCategorys, getManufacturers } = this.props
    await getCategorys()
    await getManufacturers()
    await this.load()
  }

  handleChangeRowsPerPage = (event: any) => {
    this.setState(
      {
        ...this.state,
        page: 0,
        rowsPerPage: parseInt(event.target.value, 10),
      },
      () => this.load()
    )
  }

  render() {
    const { classes } = this.props
    const { page, rowsPerPage } = this.state

    return (
      <Field name="products">
        {({ form, field }: FieldProps) => (
          <React.Fragment>
            <Grid container alignItems="center" spacing={2}>
              <Grid item lg={3} md={5} xs={12}>
                <Input
                  placeholder="Nome ou EAN do produto"
                  startAdornment={
                    <InputAdornment position="start">
                      <IconButton>
                        <img src={SearchIcon} alt="" />
                      </IconButton>
                    </InputAdornment>
                  }
                  onChange={(e) => this.onChangeField('query', e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item lg={2} md={3} xs={12}>
                <ManufacturerConsumer>
                  {({ getManufacturers, manufacturers, fetching: fetchingManufacturer }) => (
                    <Autocomplete
                      options={manufacturers}
                      onChange={(_, selected) => this.onChangeField('manufacturer', selected ? [selected._id] : [])}
                      getOptionLabel={(op: Manufacturer) => op.name}
                      onInputChange={(e: React.ChangeEvent<{}>, value: string) => {
                        getManufacturers({ name: value })
                      }}
                      clearOnBlur={false}
                      size="small"
                      className={classes.autocomplete}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Fabricante"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {fetchingManufacturer && <CircularProgress color="primary" size={20} />}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                    />
                  )}
                </ManufacturerConsumer>
              </Grid>
              <Grid item lg={2} md={3} xs={12}>
                <CategoryConsumer>
                  {({ getCategorys, categorys, fetching: fetchingCategory }) => (
                    <Autocomplete
                      options={categorys}
                      onChange={(_, selected) => this.onChangeField('category', selected ? [selected._id] : [])}
                      getOptionLabel={(op: Category) => op.name}
                      onInputChange={(e: React.ChangeEvent<{}>, value: string) => {
                        getCategorys({ name: value })
                      }}
                      clearOnBlur={false}
                      size="small"
                      className={classes.autocomplete}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Categoria"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {fetchingCategory && <CircularProgress color="primary" size={20} />}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                    />
                  )}
                </CategoryConsumer>
              </Grid>
            </Grid>
            <Box mt={2}>
              <ProductConsumer>
                {({ products, pagination, fetching }) => (
                  <TableContainer>
                    <Box hidden={!fetching} mb={1}>
                      <LinearProgress />
                    </Box>
                    <Table
                      classes={{
                        root: classes.table,
                      }}
                    >
                      <TableBody>
                        {products.map((product: Product) => {
                          const { name, classification, quantity, price, image, _id } = product
                          return (
                            <TableRow
                              key={_id}
                              classes={{
                                root: classes.tablerow,
                              }}
                            >
                              <TableCell
                                classes={{
                                  root: classes.tablecell,
                                }}
                                padding="checkbox"
                              >
                                <Checkbox
                                  checked={form.values.products.find((value: ShowcaseProduct) => value.product._id === _id)}
                                  onChange={() => {
                                    if (form.values.products.find((value: ShowcaseProduct) => value.product._id === _id)) {
                                      const value = form.values.products.filter(
                                        (newValue: ShowcaseProduct) => newValue.product._id !== _id
                                      )
                                      form.setFieldValue('products', value)
                                    } else {
                                      form.setFieldValue('products', [...field.value, { position: null, product }])
                                    }
                                  }}
                                />
                              </TableCell>
                              <TableCell
                                classes={{
                                  root: classes.tablecell,
                                }}
                                width="35%"
                              >
                                <Grid container alignItems="center" spacing={1}>
                                  <Grid item>
                                    <Avatar
                                      variant="rounded"
                                      src={image ? `${BucketS3}${image.key}` : require('../../../assets/images/doveImg.svg').default}
                                      className={classes.avatar}
                                    />
                                  </Grid>
                                  <Grid item xs={10}>
                                    <Typography noWrap>{name}</Typography>
                                  </Grid>
                                </Grid>
                              </TableCell>
                              <TableCell
                                classes={{
                                  root: classes.tablecell,
                                }}
                                align="center"
                              >
                                <Typography>{quantity ? `${quantity} un` : 'Sem quantidade'}</Typography>
                              </TableCell>
                              <TableCell
                                classes={{
                                  root: classes.tablecell,
                                }}
                                align="center"
                              >
                                <Typography>{classification ? classification?.name : 'Sem classificação'}</Typography>
                              </TableCell>
                              <TableCell
                                classes={{
                                  root: classes.tablecell,
                                }}
                              >
                                <Typography className={classes.price}>{price ? floatToBRL(price) : 'Sem preço'}</Typography>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={pagination?.total}
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
                  </TableContainer>
                )}
              </ProductConsumer>
            </Box>
          </React.Fragment>
        )}
      </Field>
    )
  }
}

export default withStyles(styles)(ShowcaseProductsTable)
