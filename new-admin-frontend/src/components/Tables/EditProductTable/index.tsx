import {
  Checkbox,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  withStyles,
} from '@material-ui/core'
import React, { Component } from 'react'
import Placeholder from '../../../assets/images/productImageHolder.svg'
import { ReactComponent as InfoIcon } from '../../../assets/images/infoIcon.svg'
import Product from '../../../interfaces/product'
import Control from '../../../interfaces/control'
import Manufacturer from '../../../interfaces/manufacturer'
import Classification from '../../../interfaces/classification'
import { floatToBRL } from '../../../helpers/moneyFormat'
// @ts-ignore
import CurrencyField from 'react-currency-input'
import style from './style'
import { Autocomplete } from '@material-ui/lab'
import { RequestGetManufacturer } from '../../../services/api/interfaces/ApiRequest'
import Category from '../../../interfaces/category'
import { BucketS3 } from '../../../config'

type Props = {
  classes: any
  products: Product[]
  controls: Control[]
  fields: string[]
  manufacturers: Manufacturer[]
  categorys: Category[]
  classifications: Classification[]
  loadControls: () => void
  loadCategorys: (...args: any) => Promise<void>
  loadClassifications: () => void
  loadManufacturers: (payload?: RequestGetManufacturer) => Promise<void>
  setProducts: (products: Product[]) => void
  fetchingManufacturers?: boolean
  fetchingCategorys?: boolean
}

type State = {
  selected: Product['_id'][]
  values: Product
  maskedMoney: string
  price: number
}

const initialValues = {
  name: '',
  model: '',
  price: 0.0,
  quantity: 0,
  status: false,
  EAN: '',
  MS: '',
  slug: [],
  category: [],
  activePrinciple: '',
  control: undefined,
  presentation: '',
  description: '',
  controlName: '',
  specials: [],
}

class EditProductTable extends Component<Props, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      selected: [],
      values: initialValues,
      maskedMoney: '',
      price: 0,
    }

    this.selectAll = this.selectAll.bind(this)
    this.select = this.select.bind(this)
  }

  componentDidMount() {
    const { loadControls, loadClassifications, loadManufacturers, loadCategorys } = this.props

    loadControls()
    loadManufacturers()
    loadClassifications()
    loadCategorys()
  }

  onChangePrice = (ev: any, maskedValue: any, floatValue: any) => {
    const { products, setProducts } = this.props
    const { selected } = this.state

    this.setState(
      (state: any) => ({
        ...state,
        maskedMoney: maskedValue,
        price: floatValue,
        values: {
          ...state.values,
          price: floatValue,
        },
      }),
      () => {
        for (const product of products) {
          if (selected.includes(product._id)) {
            product['productPrice'] = maskedValue
            product['price'] = floatValue
          }
        }

        setProducts(products)
      }
    )
  }

  editField(field: string, value: any) {
    const { products, setProducts } = this.props
    const { selected } = this.state

    for (const product of products) {
      if (selected.includes(product._id)) {
        product[field] = value
      }
    }

    this.setState(
      (state: any) => ({
        ...state,
        values: {
          ...state.values,
          [field]: value,
        },
      }),
      () => {
        setProducts(products)
      }
    )
  }

  _renderControl = () => {
    const { controls } = this.props

    if (controls.length > 0) {
      return controls.map((control) => (
        <MenuItem key={control._id} value={control._id}>
          {control.description}
        </MenuItem>
      ))
    }
  }

  _renderClassification = () => {
    const { classifications } = this.props

    if (classifications.length > 0) {
      return classifications.map((classification) => (
        <MenuItem key={classification._id} value={classification._id}>
          {classification.name}
        </MenuItem>
      ))
    }
  }

  getHeadInputs(field: string) {
    const { classes, manufacturers, fetchingManufacturers, loadManufacturers, categorys, loadCategorys, fetchingCategorys } =
      this.props
    const { values, maskedMoney } = this.state

    switch (field) {
      case 'control':
        return (
          <FormControl variant="outlined" className={classes.formcontrol}>
            <InputLabel>Controle</InputLabel>
            <Select
              label="Controle"
              variant="outlined"
              MenuProps={{
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'right',
                },
                getContentAnchorEl: null,
              }}
              value={values[field]?._id}
              onChange={({ target: { value } }) => this.editField(field, value)}
            >
              {this._renderControl()}
            </Select>
          </FormControl>
        )
      case 'classification':
        return (
          <FormControl variant="outlined" className={classes.formcontrol}>
            <InputLabel>Classificação</InputLabel>
            <Select
              label="Classificação"
              variant="outlined"
              MenuProps={{
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'right',
                },
                getContentAnchorEl: null,
              }}
              value={values[field]?._id}
              onChange={({ target: { value } }) => this.editField(field, value)}
            >
              {this._renderClassification()}
            </Select>
          </FormControl>
        )
      case 'manufacturer':
        return (
          <Autocomplete
            options={manufacturers}
            onChange={(_, selected) => this.editField(field, selected?._id)}
            getOptionLabel={(op: Manufacturer) => op.name}
            onInputChange={async (e: React.ChangeEvent<{}>, value: string) => {
              await loadManufacturers({ name: value })
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
                      {fetchingManufacturers && <CircularProgress color="primary" size={20} />}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
        )
      case 'category':
        return (
          <Autocomplete
            options={categorys}
            onChange={(_, selected) =>
              this.editField(
                field,
                selected.map((category) => category._id)
              )
            }
            getOptionLabel={(op: Category) => op.name}
            multiple
            onInputChange={async (e: React.ChangeEvent<{}>, value: string) => {
              await loadCategorys({ name: value })
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
                      {fetchingCategorys && <CircularProgress color="primary" size={20} />}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
        )
      case 'status':
        return (
          <FormControl variant="outlined" className={classes.formcontrol}>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              variant="outlined"
              MenuProps={{
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'right',
                },
                getContentAnchorEl: null,
              }}
              value={values[field]}
              onChange={({ target: { value } }) => this.editField(field, value)}
            >
              <MenuItem value={'true'}>Publicado</MenuItem>
              <MenuItem value={'false'}>Não publicado</MenuItem>
            </Select>
          </FormControl>
        )
      case 'price':
        return (
          <FormControl variant="outlined" className={classes.formcontrol}>
            <CurrencyField
              className={classes.currencyinput}
              prefix="R$ "
              decimalSeparator=","
              thousandSeparator="."
              value={maskedMoney}
              name="price"
              onChangeEvent={this.onChangePrice}
            />
          </FormControl>
        )
      default:
        return (
          <FormControl className={classes.formcontrol}>
            <TextField
              label={field}
              variant="outlined"
              value={values[field]}
              onChange={({ target: { value } }) => this.editField(field, value)}
              autoComplete="off"
            />
          </FormControl>
        )
    }
  }

  getTableCell(field: string, product: Product, index: any) {
    const { classes, categorys, manufacturers } = this.props

    switch (field) {
      case 'control':
        return (
          <TableCell
            key={index}
            classes={{
              root: classes.cell,
            }}
          >
            <Typography className={classes.title}>{product.control?.description || product.control} </Typography>
          </TableCell>
        )
      case 'category':
        return (
          <TableCell
            key={index}
            classes={{
              root: classes.cell,
            }}
          >
            <Typography className={classes.title}>
              {product.category &&product.category
                .map((category: any) => category.name || categorys.find((value) => value._id === category)?.name || category)
                .join(',')}
            </Typography>
          </TableCell>
        )
      case 'classification':
        return (
          <TableCell
            key={index}
            classes={{
              root: classes.cell,
            }}
          >
            <Typography className={classes.title}>{product.classification?.name || product.classification} </Typography>
          </TableCell>
        )
      case 'manufacturer':
        return (
          <TableCell
            key={index}
            classes={{
              root: classes.cell,
            }}
          >
            <Typography className={classes.title}>
              {product.manufacturer?.name ||
                manufacturers.find((value) => value._id === product.manufacturer)?.name ||
                product.manufacturer}
            </Typography>
          </TableCell>
        )
      case 'status':
        return (
          <TableCell
            key={index}
            classes={{
              root: classes.cell,
            }}
          >
            <Select value={product['status'].toString()} className={classes.select} disabled={true}>
              <MenuItem value={'' + true}>Publicado</MenuItem>
              <MenuItem value={'' + false}>Não publicado</MenuItem>
            </Select>
          </TableCell>
        )
      case 'price':
        return (
          <TableCell
            key={index}
            classes={{
              root: classes.cell,
            }}
          >
            <Typography className={classes.title}>{product.price && floatToBRL(product.price)}</Typography>
          </TableCell>
        )
      default:
        return (
          <TableCell
            key={index}
            classes={{
              root: classes.cell,
            }}
          >
            <Typography className={classes.title}>{product[field as any] && '' + product[field as any]}</Typography>
          </TableCell>
        )
    }
  }

  selectAll = () => {
    const { selected } = this.state
    const { products } = this.props

    if (selected.length === products.length) {
      this.setState((state: any) => ({
        ...state,
        selected: [],
        values: { ...initialValues },
      }))
    } else {
      const ids = products.map((p) => p._id)

      this.setState((state: any) => ({
        ...state,
        selected: [...ids],
        values: { ...initialValues },
      }))
    }
  }

  select = (id: Product['_id']) => {
    const { selected } = this.state

    if (!selected.includes(id)) {
      this.setState((state: any) => ({
        ...state,
        selected: [...state.selected, id],
        values: { ...initialValues },
      }))
    } else {
      const index = selected.findIndex((x) => x === id)

      selected.splice(index, 1)

      this.setState((state: any) => ({
        ...state,
        selected,
        values: { ...initialValues },
      }))
    }
  }

  enhancedTableHead() {
    const { classes, fields, products } = this.props
    const {
      selected,
      values: { name },
    } = this.state

    return (
      <TableHead>
        <TableRow
          classes={{
            root: classes.rowroot,
          }}
        >
          <TableCell
            padding="checkbox"
            classes={{
              root: classes.cellrowroot,
            }}
          >
            <Checkbox checked={products.length > 0 && selected.length === products.length} onChange={this.selectAll} />
          </TableCell>
          <TableCell
            classes={{
              root: classes.cellrowroot,
            }}
          >
            <FormControl className={classes.formcontrol}>
              <TextField
                name="name"
                value={name}
                label={'Titulo'}
                variant="outlined"
                onChange={({ target: { value } }) => this.editField('name', value)}
                autoComplete="off"
              />
            </FormControl>
          </TableCell>
          {fields.map((field, index: any) => (
            <TableCell
              classes={{
                root: classes.cellrowroot,
              }}
              key={index}
            >
              {this.getHeadInputs(field)}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    )
  }

  defaultTableHead() {
    const { classes, fields, products } = this.props
    const { selected } = this.state

    return (
      <TableHead>
        <TableRow>
          <TableCell
            classes={{
              root: classes.titlehead,
            }}
            padding="checkbox"
          >
            <Checkbox checked={products.length > 0 && selected.length === products.length} onChange={this.selectAll} />
          </TableCell>
          <TableCell
            classes={{
              root: classes.titlehead,
            }}
          >
            Título
          </TableCell>
          {fields.map((value: any, index: any) =>
            value.field !== 'locked' ? (
              <TableCell key={index}>{value.name}</TableCell>
            ) : (
              <TableCell key={index}>
                Travar
                <Tooltip title="A informação de preço e (ou) estoque editada irá sobrepor-se aos dados vindos do seu ERP">
                  <InfoIcon style={{ marginLeft: 5 }} />
                </Tooltip>
              </TableCell>
            )
          )}
        </TableRow>
      </TableHead>
    )
  }

  render() {
    const { classes, fields, products } = this.props
    const { selected } = this.state

    return (
      <TableContainer
        classes={{
          root: classes.container,
        }}
      >
        <Table>
          {selected.length > 0 ? this.enhancedTableHead() : this.defaultTableHead()}
          <TableBody>
            {products.map((product: Product) => (
              <TableRow key={product._id}>
                <TableCell
                  padding="checkbox"
                  classes={{
                    root: classes.cell,
                  }}
                >
                  <Checkbox onChange={() => this.select(product._id)} checked={selected.includes(product._id)} />
                </TableCell>
                <TableCell
                  classes={{
                    root: classes.cell,
                  }}
                >
                  <div className={classes.row}>
                    <img
                      src={product.image ? `${BucketS3}${product.image.url}` : Placeholder}
                      alt=""
                      className={classes.titleimg}
                    />
                    <Typography className={classes.title}>{product.name}</Typography>
                  </div>
                </TableCell>
                {fields.map((field: string, index: number) => this.getTableCell(field, product, index))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }
}

export default withStyles(style)(EditProductTable)
