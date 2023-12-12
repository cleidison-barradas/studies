import CustomDialog from '../../CustomDialog'
import { Component } from 'react'
import { Box, Button, Grid, Typography, withStyles } from '@material-ui/core'
import styles from './style'
import Product from '../../../interfaces/product'
import CurrencyTextField from '../../CurrencyTextField'

type Props = {
  classes: any
  open: boolean
  onClose: any
  product: Product | undefined
  productsInfo: { EAN: string; amount: number; price: number }[]
  changeProductPrice: (EAN: string | undefined, price: number) => void
}

type State = {
  price: number | undefined
}

class DialogChangeProductPriceInLink extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      price: 0.0,
    }
  }

  renderContent() {
    const { product, classes } = this.props
    return (
      <>
        {product ? (
          <Box className={classes.productInformations}>
            <Box>
              <Typography className={classes.productName}> {product.name}</Typography>
              <Typography className={classes.productEAN}> {product.EAN}</Typography>
            </Box>
            <Box className={classes.pricesBox}>
              <Box className={classes.priceBox}>
                <Typography className={classes.deskPrice}> Preço original</Typography>
                <CurrencyTextField
                  prefix="R$ "
                  value={product.price}
                  decimalSeparator=","
                  thousandSeparator="."
                  className={classes.currencyinput}
                  onChange={() => null}
                  disabled
                />
              </Box>
              {product.specials && product.specials.length > 0 && (
                <Box className={classes.priceBox}>
                  <Typography className={classes.deskPrice}> Preço promocional</Typography>
                  <CurrencyTextField
                    prefix="R$ "
                    value={product.specials[0].price}
                    decimalSeparator=","
                    thousandSeparator="."
                    className={classes.currencyinput}
                    onChange={() => null}
                    disabled
                  />
                </Box>
              )}
              <Box className={classes.priceBox}>
                <Typography className={classes.deskPrice}> Novo preço</Typography>
                <CurrencyTextField
                  prefix="R$ "
                  value={this.state.price}
                  decimalSeparator=","
                  thousandSeparator="."
                  className={classes.currencyinput}
                  onChange={({ floatValue }) => this.setState({ price: floatValue })}
                />
              </Box>
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography> Selecione um produto para alterar o preço</Typography>
          </Box>
        )}
      </>
    )
  }

  async confirmChange() {
    const { product, changeProductPrice } = this.props
    const { price } = this.state
    changeProductPrice(product?.EAN, price!)
    this.props.onClose()
    setTimeout(() => {
      this.setState({ price: 0.0 })
    }, 500)
  }

  renderFooter() {
    const { onClose } = this.props
    return (
      <>
        <Grid container justify="flex-end">
          <Grid item>
            <Grid container spacing={2}>
              <Grid item>
                <Button onClick={onClose}>Cancelar</Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" onClick={() => this.confirmChange()}>
                  Alterar
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </>
    )
  }

  render() {
    const { open, onClose, classes } = this.props
    return (
      <CustomDialog
        open={open}
        title={'Alterar Preço'}
        closeModal={onClose}
        paperWidthSm={classes.paperWidthSm}
        content={() => this.renderContent()}
        footer={() => this.renderFooter()}
      />
    )
  }
}

export default withStyles(styles)(DialogChangeProductPriceInLink)
