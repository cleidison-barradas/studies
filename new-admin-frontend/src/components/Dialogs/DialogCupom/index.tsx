import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  Input,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
  withStyles,
} from '@material-ui/core'
import { Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab'
import { startOfDay } from 'date-fns'
import moment from 'moment'
import React, { Component } from 'react'
import Category from '../../../interfaces/category'
import Cupom from '../../../interfaces/cupom'
import Product from '../../../interfaces/product'
import { RequestPutCupom } from '../../../services/api/interfaces/ApiRequest'
import { StoreConsumer } from '../../../context/StoreContext'
import DatePicker from '../../CustomDatePicker'
import CustomDialog from '../../CustomDialog'
import style from './style'

type Props = {
  classes: any
  open: boolean
  changeModal: any
  getCategorys: (...args: any) => void
  getCupoms: (...args: any) => void
  getProducts: (...args: any) => void
  categorys: Category[]
  products: Product[]
  addCupom: (data: RequestPutCupom) => Promise<void>
  success: any
  fetching: any
  fetchingProducts: any
}

type State = {
  coupom: Cupom
  categorys: Category[]
  radio: any
  notify: boolean
}

class NewCupom extends Component<Props, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      coupom: {
        descountCategorys: [],
        status: true,
        timesUsed: 0,
        code: '',
        allProducts: false,
        products: [],
        name: '',
        type: 'PRODUCT',
        productBlacklist: [],
        initialDate: new Date(),
        amount: 0,
      },
      notify: true,
      categorys: [],
      radio: 'ilimited',
    }
    this.random = this.random.bind(this)
    this.onChange = this.onChange.bind(this)
    this.setRadio = this.setRadio.bind(this)
    this.save = this.save.bind(this)
  }

  onChange(field: any, value: any) {
    this.setState({
      ...this.state,
      coupom: {
        ...this.state.coupom,
        [field]: value,
      },
    })
  }

  setRadio(e: any, radio: any) {
    if (radio === 'ilimited') {
      this.setState({
        ...this.state,
        radio,
        coupom: {
          ...this.state.coupom,
          amount: 0,
        },
      })
    } else {
      this.setState({
        ...this.state,
        radio,
      })
    }
  }

  componentDidMount() {
    const { getCategorys, getProducts } = this.props
    getCategorys()
    getProducts()
  }

  random() {
    let result: string = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    this.onChange('code', result)
  }

  Content(classes: any) {
    const { coupom, radio, notify } = this.state
    const { categorys, getCategorys, getProducts, products, fetchingProducts } = this.props
    return (
      <>
        <Box mb={2}>
          <TextField
            fullWidth
            label={'Nome do cupom'}
            classes={{
              root: classes.textfield,
            }}
            onChange={(e) => this.onChange('name', e.target.value)}
            variant="outlined"
            value={coupom.name}
          />
        </Box>
        <TextField
          fullWidth
          label={'Código'}
          classes={{
            root: classes.textfield,
          }}
          onChange={(e) => this.onChange('code', e.target.value)}
          variant="outlined"
          value={coupom.code}
        />
        <Grid container justify="space-between" alignItems="center">
          <Typography className={classes.caption}>Este é o código que seu cliente deverá inserir no momento da compra</Typography>
          <Button
            color="primary"
            classes={{
              root: classes.generatebtn,
            }}
            onClick={this.random}
          >
            Gerar auto
          </Button>
        </Grid>

        <Box mt={3} mb={3}>
          <TextField
            fullWidth
            label={'Tipo de desconto'}
            classes={{
              root: classes.textfield,
            }}
            select
            variant="outlined"
            onChange={(e: any) => this.onChange('type', e.target.value)}
            value={coupom.type}
          >
            <MenuItem value="PRODUCT">Produto</MenuItem>
            <MenuItem value="CATEGORY">Categoria</MenuItem>
          </TextField>
        </Box>

        {coupom.type !== 'DELIVERY' && (
          <Box mb={3}>
            <Grid container>
              <Grid item lg={3} md={3} sm={12} xs={12}>
                <Box mt={1}>
                  <Typography className={classes.inputitle}>Desconto de</Typography>
                </Box>
              </Grid>
              <Grid item lg={9} md={9} sm={12} xs={12}>
                <Input
                  fullWidth
                  type="number"
                  classes={{
                    root: classes.textfield,
                  }}
                  onChange={(e: any) => this.onChange('descountPercentage', Number(e.target.value))}
                  value={coupom.descountPercentage}
                  endAdornment={
                    <InputAdornment position="end" className={classes.adornment}>
                      %
                    </InputAdornment>
                  }
                />
                <Box mt={1}>
                  <Typography className={classes.caption}>
                    Esta é a procentagem de desconto que o cliente receberá sobre o valor da compra (não se aplica ao frete).
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        <Typography className={classes.boldtitle}>Limitar a quantidade de usos por cliente</Typography>
        <FormControl component="fieldset">
          <RadioGroup onChange={this.setRadio} value={radio}>
            <FormControlLabel value="ilimited" control={<Radio />} label="Ilimitado" />
            <FormControlLabel
              value="amount"
              control={
                <>
                  <Radio value="amount" />
                  <Input
                    type="number"
                    className={classes.inputuses}
                    onChange={(e: any) => this.onChange('amount', e.target.value)}
                    value={coupom.amount}
                    disabled={radio === 'ilimited'}
                    inputProps={{
                      min: 1,
                    }}
                  />
                </>
              }
              label="Usos"
            />
          </RadioGroup>
        </FormControl>

        <Box mt={3}>
          <Typography className={classes.boldtitle}>Valor minímo R$</Typography>
          <Typography className={classes.caption}>Só para compras acima de</Typography>
          <Box mt={1}>
            <Input
              fullWidth
              type="number"
              classes={{
                root: classes.textfield,
              }}
              onChange={(e: any) => this.onChange('minimumPrice', Number(e.target.value))}
              startAdornment={<InputAdornment position="start">R$</InputAdornment>}
            />
          </Box>
        </Box>

        {coupom.type !== 'DELIVERY' && (
          <Box mt={3}>
            <Box mt={1}>
              {coupom.type === 'CATEGORY' ? (
                <React.Fragment>
                  <Typography className={classes.boldtitle}>Aplicar apenas nos produtos desta(s) categoria(s)</Typography>
                  <Autocomplete
                    options={categorys}
                    limitTags={3}
                    getOptionDisabled={(option: Category) =>
                      coupom.descountCategorys.find((category: Category) => category._id === option._id) ? true : false
                    }
                    getOptionLabel={(option: any) => option.name}
                    selectOnFocus
                    onChange={(ev: any, newCategorys: Category[]) => {
                      this.onChange('descountCategorys', newCategorys)
                    }}
                    clearOnBlur
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        rows={3}
                        onChange={(e) => getCategorys({ name: e.target.value })}
                        multiline
                      />
                    )}
                    multiple
                  />
                </React.Fragment>
              ) : (
                <>
                  <StoreConsumer>
                    {({ store }) => (
                      <React.Fragment>
                        {coupom.allProducts && store?.settings.config_new_layout ? (
                          <React.Fragment>
                            <Typography className={classes.boldtitle}>Remover apenas esses produto(s)</Typography>
                            <Autocomplete
                              multiple
                              selectOnFocus
                              limitTags={3}
                              options={products}
                              disabled={!coupom.allProducts}
                              getOptionDisabled={(product: Product) =>
                                !!coupom.productBlacklist &&
                                coupom.productBlacklist.filter((p) => p.EAN === product.EAN).length > 0
                              }
                              value={coupom.productBlacklist}
                              getOptionLabel={(product: Product) => `${product.name} | ${product.EAN}`}
                              onChange={(ev: any, newProducts: Product[]) => {
                                this.onChange('productBlacklist', newProducts)
                              }}
                              onInputChange={(e: React.ChangeEvent<{}>, value: string) => {
                                getProducts({ query: value })
                              }}
                              renderInput={(params: AutocompleteRenderInputParams) => (
                                <TextField
                                  {...params}
                                  rows={3}
                                  multiline
                                  label="Produtos"
                                  variant="outlined"
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                      <React.Fragment>
                                        {fetchingProducts && <CircularProgress color="primary" size={20} />}
                                        {params.InputProps.endAdornment}
                                      </React.Fragment>
                                    ),
                                  }}
                                />
                              )}
                            />
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <Typography className={classes.boldtitle}>Aplicar apenas nesses produto(s) </Typography>
                            <Autocomplete
                              multiple
                              selectOnFocus
                              options={products}
                              disabled={coupom.allProducts}
                              getOptionDisabled={(product: Product) =>
                                coupom.products && coupom.products.filter((p) => p.EAN === product.EAN).length > 0 ? true : false
                              }
                              value={coupom.products}
                              getOptionLabel={(product: Product) => `${product.name} - ${product.EAN}`}
                              onChange={(ev: any, newProducts: Product[]) => {
                                this.onChange('products', newProducts)
                              }}
                              onInputChange={(e: React.ChangeEvent<{}>, value: string) => {
                                getProducts({ query: value })
                              }}
                              renderInput={(params: AutocompleteRenderInputParams) => (
                                <TextField
                                  {...params}
                                  rows={3}
                                  multiline
                                  label="Produtos"
                                  variant="outlined"
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                      <React.Fragment>
                                        {fetchingProducts && <CircularProgress color="primary" size={20} />}
                                        {params.InputProps.endAdornment}
                                      </React.Fragment>
                                    ),
                                  }}
                                />
                              )}
                            />
                          </React.Fragment>
                        )}
                      </React.Fragment>
                    )}
                  </StoreConsumer>
                  <FormControlLabel
                    control={<Checkbox color="primary" />}
                    label="Adicionar para todos os produtos do estoque?"
                    checked={coupom.allProducts}
                    onChange={(ev: any) => this.onChange('allProducts', ev.target.checked)}
                    labelPlacement="end"
                  />
                </>
              )}
            </Box>
          </Box>
        )}

        <Box mt={3}>
          <FormControlLabel
            control={
              <Switch
                defaultChecked
                onChange={(ev, value) => {
                  this.setState({
                    ...this.state,
                    notify: value,
                  })
                }}
                value={notify}
              />
            }
            label={<Typography className={classes.boldtitle}>Notificar clientes por email? </Typography>}
          />
        </Box>
        <Box mt={3}>
          <Typography className={classes.boldtitle}>Limitar utilização por data</Typography>
          <Box mt={1}>
            <Grid container justify="space-between">
              <Grid item>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Typography className={classes.inputitle}>Inicia em</Typography>
                  </Grid>
                  <Grid item>
                    <DatePicker
                      date={coupom.initialDate}
                      setDate={(date: Date) => this.onChange('initialDate', startOfDay(new Date(date)))}
                      className={classes.datepicker}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Typography className={classes.inputitle}>Finaliza em</Typography>
                  </Grid>
                  <Grid item>
                    <DatePicker
                      date={coupom.finalDate}
                      setDate={(date: Date) =>
                        this.onChange('finalDate', moment.utc(date).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'))
                      }
                      className={classes.datepicker}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </>
    )
  }

  async save() {
    const { changeModal, addCupom, getCupoms } = this.props
    const { coupom, notify } = this.state
    await addCupom({ cupom: coupom, notify })

    const { success } = this.props

    if (success) {
      changeModal()
      await getCupoms()
    }

    this.setState((state: any) => ({
      ...state,
      coupom: {
        descountCategorys: [],
        status: true,
        timesUsed: 0,
        productBlacklist: [],
        code: '',
        allProducts: false,
        products: [],
        name: '',
        type: 'PRODUCT',
        initialDate: new Date(),
        amount: 0,
      },
      notify: true,
    }))
  }

  footer() {
    const { changeModal, fetching } = this.props
    return (
      <>
        <Grid container justify="flex-end">
          <Grid item>
            <Grid container spacing={2}>
              <Grid item>
                <Button onClick={changeModal}>Cancelar</Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" disabled={fetching} onClick={this.save}>
                  {fetching ? <CircularProgress /> : 'Criar'}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </>
    )
  }

  render() {
    const { classes, open, changeModal } = this.props
    return (
      <CustomDialog
        title="Criar Cupom"
        open={open}
        closeModal={changeModal}
        paperWidthSm={classes.paperWidthSm}
        content={() => this.Content(classes)}
        footer={() => this.footer()}
      />
    )
  }
}

export default withStyles(style)(NewCupom)
