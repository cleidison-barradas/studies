import { Box, CircularProgress, Typography, TextField, withStyles, Button, IconButton, Grid, Tooltip } from '@material-ui/core'
import React, { Component } from 'react'
import PaperBlock from '../../PaperBlock'
import { Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab'
import styles from './styles'
import Product from '../../../interfaces/product'
import ChipQuantity from '../../ChipQuantity'
import { FileCopyOutlined, InfoOutlined } from '@material-ui/icons'
import { ReactComponent as GoBackIcon } from '../../../assets/images/goBack.svg'
import { ReactComponent as WhatsappIcon } from '../../../assets/images/whatsapp.svg'
import { RouterProps } from 'react-router-dom'
import * as yup from 'yup'
import DialogChangeProductPriceInLink from '../../Dialogs/DialogChangeProductPriceInLink'
import PaymentLinkForm from '../../../interfaces/paymentLinkForm'
import { PaymentLinkResponse } from '../../../services/api/interfaces/ApiResponse'
import Store from '../../../interfaces/store'
import CurrencyTextField from '../../CurrencyTextField'
import classNames from 'classnames'
import SuportLink from '../../SuportLink'
import CurrencyTextFieldNew from '../../CurrencyTextFieldNew'

interface Props extends RouterProps {
  classes: Record<keyof ReturnType<typeof styles>, string>
  products: Product[]
  getProducts: (...args: any) => void
  fetchingProducts: any
  createPaymentLink: (paymentLinkForm: PaymentLinkForm) => Promise<PaymentLinkResponse | null>
  store: Store | null
}

export type ProductAmount = { EAN: string; amount: number; price: number; promotional?: boolean }

type State = {
  products: Product[]
  productsAmount: ProductAmount[]
  total: number
  deliveryFee: string | undefined
  openedModalEditPrice: boolean
  changingProduct: Product | undefined
  paymentLink: string
  orderText: string
}

class LinkPaper extends Component<Props, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      products: [],
      productsAmount: [],
      total: 0.0,
      openedModalEditPrice: false,
      changingProduct: undefined,
      deliveryFee: undefined,
      paymentLink: '',
      orderText: '',
    }
  }

  initialValues = {
    products: [],
    productsAmount: [],
  }

  messages = {
    tooltipDeliveryFee:
      'Se você deixar este campo vazio, no próprio link de pagamento o cliente informará o endereço e a taxa de entrega será calculada automaticamente',
    tooltipPromotionalPriceInfo:
      'Os produtos marcados com dois asteriscos ao lado (**) possuem preço promocionais aplicados. Ao alterar o preço o preço promocional será ignorado.',
  }

  schemaValidation = yup.object().shape({
    products: yup.array().required('Selecione ao menos um produto'),
  })

  onChange(field: any, value: any) {
    if (field === 'products') {
      let newProductsAmount: ProductAmount[] = []
      if (value.length > this.state.products.length) {
        const newProduct = value[value.length - 1]
        let productPrice = newProduct.price
        let promotional = false
        if (newProduct.specials.length > 0 && newProduct.specials[0].price < productPrice) {
          productPrice = newProduct.specials[0].price
          promotional = true
        }
        newProductsAmount = [...this.state.productsAmount, { amount: 1, EAN: newProduct.EAN, price: productPrice, promotional }]
      } else {
        const removedProduct = this.state.products.filter((p) => !value.includes(p))
        newProductsAmount = this.state.productsAmount.filter((p) => p.EAN !== removedProduct[0].EAN)
      }

      this.setState({
        ...this.state,
        products: value,
        productsAmount: newProductsAmount,
        total: this.calculateTotal(newProductsAmount),
        orderText: '',
      })
    } else
      this.setState({
        ...this.state,
        [field]: value,
      })
  }

  changeQuantity = (amount: number, EAN: string | undefined) => {
    if (!EAN) return
    const newProductsAmount = this.state.productsAmount.map((p) => {
      if (p.EAN === EAN) {
        const product = this.state.products.find((p) => p.EAN === EAN) as Product
        const newAmount = p.amount + amount <= product.quantity ? p.amount + amount : p.amount
        p.amount = newAmount > 0 ? newAmount : 1
      }
      return p
    })
    this.setState({
      ...this.state,
      productsAmount: newProductsAmount,
      total: this.calculateTotal(newProductsAmount),
      orderText: '',
    })
  }

  changeProductPrice = (EAN: string | undefined, price: number) => {
    if (!EAN) return
    const newProductsAmount = this.state.productsAmount.map((p) => {
      if (p.EAN === EAN) {
        p.price = price
      }
      return p
    })
    setInterval(() => {
      this.setState({
        ...this.state,
        productsAmount: newProductsAmount,
        total: this.calculateTotal(newProductsAmount),
        orderText: '',
      })
    }, 5000)
  }

  calculateTotal = (productsAmount: ProductAmount[]) => {
    let total = 0
    productsAmount.forEach((p) => {
      total += p.amount * p.price
    })
    return total
  }

  setFieldPrice = (e: any) => {
    const inputPrice = document.getElementById('fieldPrice')
    if (inputPrice) {
      inputPrice.style.top = `${e.target.offsetTop}px`
      inputPrice.style.left = `${e.target.offsetLeft}px`
    }
  }

  toggleModalChangePrice = () => {
    this.setState({
      ...this.state,
      openedModalEditPrice: !this.state.openedModalEditPrice,
    })
  }

  openModalChangePrice = (product: Product | undefined) => {
    if (!product) return
    this.setState({
      ...this.state,
      openedModalEditPrice: true,
      changingProduct: product,
    })
  }

  copyLinkToClipboard = () => {
    navigator.clipboard.writeText(this.state.paymentLink)
  }

  copyOrderTextToClipboard = () => {
    navigator.clipboard.writeText(this.state.orderText)
  }

  generateOrderText = () => {
    const { products, productsAmount, deliveryFee, total } = this.state
    let text = `*Confirme os dados do seu pedido:*\n\n`

    let noDiscountTotal = 0
    products.forEach((product) => {
      const productInformations = productsAmount.find((_product) => _product.EAN === product.EAN)
      const amount = productInformations?.amount as number
      const customPrice = productInformations?.price as number
      let priceText = `R$${customPrice.toFixed(2)}`

      if (product.price && product.price > customPrice) {
        noDiscountTotal += product.price * amount
        priceText = `De ~R$${product.price.toFixed(2)}~ por R$${customPrice.toFixed(2)}`
      } else if (product['erp_pmc'] > product.price) {
        noDiscountTotal += product['erp_pmc'] * amount
        priceText = `De ~R$${product['erp_pmc'].toFixed(2)}~ por R$${product.price.toFixed(2)}`
      } else {
        noDiscountTotal += customPrice * amount
      }

      text += `${amount}x ${product.name}: ${priceText}\n`
    })
    if (deliveryFee) text += `Taxa de entrega: R$ ${deliveryFee}\n`

    const totalPriceText =
      total < noDiscountTotal ? `De ~R$${noDiscountTotal.toFixed(2)}~ por R$ ${total.toFixed(2)}` : `R$ ${total.toFixed(2)}`

    text += `--------------------------------------\n`
    text += `*_Total do pedido: ${totalPriceText}_* \n\n`
    text += `*Posso encaminhar o link para você finalizar o pedido?*`

    this.setState({
      ...this.state,
      orderText: text,
    })
  }

  handleCreatePaymentLink = async () => {
    const products = this.state.products.map((p) => {
      return {
        product: {
          ...p,
          price: this.state.productsAmount.find((product) => product.EAN === p.EAN)?.price as number,
        },
        amount: this.state.productsAmount.find((product) => product.EAN === p.EAN)?.amount as number,
      }
    })

    const numberDeliveryFee =
      this.state.deliveryFee === undefined ? undefined : Number(this.state.deliveryFee.replace('.', '').replace(',', '.'))

    const paymentLinkForm: PaymentLinkForm = {
      products,
      total: this.state.total,
      deliveryFee: numberDeliveryFee,
      storeUrl: this.props.store?.url as string,
    }
    const paymentLink = await this.props.createPaymentLink(paymentLinkForm)
    if (paymentLink) {
      this.setState({
        ...this.state,
        paymentLink: paymentLink.link,
      })
    }
  }
  render() {
    const { classes, products, getProducts, fetchingProducts, history } = this.props
    const { openedModalEditPrice, changingProduct } = this.state
    return (
      <React.Fragment>
        <Box mt={2} mb={3}>
          <Box alignItems="space-between">
            <Grid item className={classes.headerBack}>
              <Grid container spacing={2}>
                <Grid item>
                  <IconButton
                    classes={{
                      root: classes.iconbtn,
                    }}
                    onClick={() => history.goBack()}
                  >
                    <GoBackIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <Typography className={classes.headertxt}>Novo Link de Pagamento</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container spacing={2}>
                <PaperBlock title={'Link de pagamento'}>
                  <Box className={classes.contentBox}>
                    <Box mb={2}>
                      <Typography className={classes.caption}>
                        Preencha os campos abaixo para gerar um link de pagamento e enviar ao seu cliente
                      </Typography>
                    </Box>
                    <Box mb={1}>
                      <Typography className={classes.boldtitle}>
                        Escolha os produtos do pedido
                        <Tooltip title={this.messages.tooltipPromotionalPriceInfo} style={{ margin: '5px 4px' }}>
                          <InfoOutlined className={classes.deliveryFeeTolltipIcon} />
                        </Tooltip>
                      </Typography>
                      {this.state.products.length}
                      <Autocomplete
                        multiple
                        selectOnFocus
                        options={products}
                        getOptionDisabled={(product: Product) =>
                          this.state.products && this.state.products.filter((p) => p.EAN === product.EAN).length > 0
                            ? true
                            : false
                        }
                        value={this.state.products}
                        getOptionLabel={(product: Product) =>
                          `${product.name} | ${product.EAN} | R$ ${product.price ? product.price.toFixed(2) : '????'}`
                        }
                        onChange={(_, newProducts: Product[]) => {
                          this.onChange('products', newProducts)
                        }}
                        onInputChange={(e: React.ChangeEvent<{}>, value: string) => {
                          getProducts({ query: value, miscellaneousFilters: ['with_quantity'] })
                        }}
                        renderTags={(value, getTagProps) =>
                          value.map((product, index) => (
                            <ChipQuantity
                              key={'chip' + index}
                              productInfo={this.state.productsAmount.find((productInfo) => productInfo.EAN === product?.EAN)}
                              product={product}
                              index={index}
                              getTagProps={getTagProps}
                              changeQuantity={this.changeQuantity}
                              setFieldPrice={this.setFieldPrice}
                              openModalChangePrice={this.openModalChangePrice}
                            />
                          ))
                        }
                        renderInput={(params: AutocompleteRenderInputParams) => (
                          <TextField
                            {...params}
                            rows={3}
                            multiline
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
                    </Box>
                    <Box mb={2} className={classes.pricesBox}>
                      <Box>
                        <Box mt={1}>
                          <CurrencyTextField
                            prefix="R$ "
                            label={'Total do pedido R$'}
                            value={this.state.total}
                            decimalSeparator=","
                            thousandSeparator="."
                            className={classNames(classes.textfield, classes.textFieldCurrency)}
                            onChange={({ floatValue }) => this.onChange('minimumPrice', floatValue)}
                            disabled
                          />
                        </Box>
                      </Box>

                      <Box className={classes.deliveryFeeBox}>
                        <Box mt={1}>
                          <CurrencyTextFieldNew
                            prefix="R$ "
                            placeholder="R$ 0,00"
                            label={'Taxa de entrega R$'}
                            value={this.state.deliveryFee}
                            decimalSeparator=","
                            thousandSeparator="."
                            className={classNames(classes.textfield, classes.textFieldCurrency)}
                            onChange={(value) => this.onChange('deliveryFee', value)}
                          />
                        </Box>
                        <Tooltip title={this.messages.tooltipDeliveryFee}>
                          <InfoOutlined className={classes.deliveryFeeTolltipIcon} />
                        </Tooltip>
                      </Box>
                    </Box>
                    <Box mb={1}>
                      <Button
                        variant="contained"
                        className={classes.generateTemplateBtn}
                        disabled={this.state.products.length === 0}
                        onClick={this.generateOrderText}
                      >
                        <Box
                          style={{
                            display: 'flex',
                            gap: '10px',
                          }}
                        >
                          Gerar texto da comanda
                          <WhatsappIcon />
                        </Box>
                      </Button>
                    </Box>
                    <Box mb={3}>
                      <TextField
                        fullWidth
                        multiline
                        rows={5}
                        variant="outlined"
                        classes={{ root: classes.textfield }}
                        value={this.state.orderText}
                        InputProps={{
                          endAdornment: (
                            <IconButton onClick={() => this.copyOrderTextToClipboard()}>
                              <FileCopyOutlined color="primary" />
                            </IconButton>
                          ),
                        }}
                      />
                    </Box>
                    <Box mb={1}>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={this.state.products.length === 0}
                        onClick={() => this.handleCreatePaymentLink()}
                      >
                        GERAR LINK
                      </Button>
                    </Box>
                    <Box className={classes.paymentlink}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        classes={{ root: classes.textfield }}
                        type="text"
                        label={'Link de pagamento'}
                        value={this.state.paymentLink}
                        InputProps={{
                          endAdornment: (
                            <IconButton onClick={() => this.copyLinkToClipboard()}>
                              <FileCopyOutlined color="primary" />
                            </IconButton>
                          ),
                        }}
                      />
                    </Box>
                  </Box>
                </PaperBlock>
              </Grid>
            </Grid>
          </Box>
          <SuportLink query="televendas" />
        </Box>
        <DialogChangeProductPriceInLink
          open={openedModalEditPrice}
          onClose={this.toggleModalChangePrice}
          product={changingProduct}
          productsInfo={this.state.productsAmount}
          changeProductPrice={this.changeProductPrice}
        />
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(LinkPaper)
