import { Chip, withStyles, Box, Button, Typography } from '@material-ui/core'
import { Component } from 'react'
import styles from './style'
import Product from '../../interfaces/product'
import { Edit } from '@material-ui/icons'
import { ProductAmount } from '../Papers/LinkPaper'

type Props = {
  classes: Record<keyof ReturnType<typeof styles>, string>
  label?: string
  index?: any
  getTagProps?: any
  product?: Product
  productInfo?: ProductAmount
  changeQuantity: (amount: number, EAN: string | undefined) => void
  setFieldPrice: (e: any) => void
  openModalChangePrice: (product: Product | undefined) => void
}

class ChipQuantity extends Component<Props> {
  render() {
    const { product, index, getTagProps, classes, productInfo, changeQuantity, openModalChangePrice } = this.props

    return (
      <Chip
        fullWidth
        style={{ height: '50px', borderRadius: '30px' }}
        label={
          <Box className={classes.labelBox}>
            <Box className={classes.boxQuantity}>
              <Button className={classes.buttonQuantity} onClick={() => changeQuantity(-1, product?.EAN)}>
                -
              </Button>
              <Typography>{productInfo?.amount || 0}</Typography>
              <Button className={classes.buttonQuantity} onClick={() => changeQuantity(1, product?.EAN)}>
                +
              </Button>
            </Box>
            <Box className={classes.boxPrice}>
              <Typography className={classes.price}>{`R$ ${(productInfo?.price || 0).toFixed(2)} unt${
                productInfo?.promotional ? ' **' : ''
              }`}</Typography>

              <Button className={classes.buttonEditPrice} onClick={() => openModalChangePrice(product)}>
                <Edit color="primary" />
              </Button>
            </Box>
            <Box className={classes.infoBox}>
              <Box>{product?.name}</Box>
              <Box className={classes.subtitle}>{product?.EAN}</Box>
            </Box>
          </Box>
        }
        size="string"
        {...getTagProps({ index })}
        component="div"
      />
    )
  }
}

export default withStyles(styles)(ChipQuantity)
