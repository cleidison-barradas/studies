import React, { Component } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, withStyles } from '@material-ui/core'
import { floatToBRL } from '../../../helpers/moneyFormat'
import ProductOrder from '../../../interfaces/productOrder'
import style from './style'

type Props = {
  classes: any
  products: ProductOrder[]
}

class OrderProductsTable extends Component<Props> {
  render() {
    const { classes, products } = this.props
    return (
      <TableContainer>
        <Table
          classes={{
            root: classes.tableroot,
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                color="primary"
                classes={{
                  root: classes.tablecellroot,
                }}
              >
                <Typography className={classes.tableheadtxt}>Nome</Typography>
              </TableCell>
              <TableCell
                color="primary"
                classes={{
                  root: classes.tablecellroot,
                }}
              >
                <Typography className={classes.tableheadtxt}>EAN</Typography>
              </TableCell>
              <TableCell
                color="primary"
                classes={{
                  root: classes.tablecellroot,
                }}
                align="right"
              >
                <Typography className={classes.tableheadtxt}>Quantidade</Typography>
              </TableCell>
              <TableCell
                color="primary"
                classes={{
                  root: classes.tablecellroot,
                }}
                align="right"
              >
                <Typography className={classes.tableheadtxt}>Valor</Typography>
              </TableCell>
              <TableCell
                color="primary"
                classes={{
                  root: classes.tablecellroot,
                }}
                align="right"
              >
                <Typography className={classes.tableheadtxt}>Total</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length > 0
              && products?.map((productItem) => (
                <TableRow key={productItem.product._id}>
                  <TableCell
                    color="primary"
                    classes={{
                      root: classes.tablecellroot,
                    }}
                  >
                    <Typography>{productItem.product.name}</Typography>
                  </TableCell>
                  <TableCell
                    color="primary"
                    classes={{
                      root: classes.tablecellroot,
                    }}
                  >
                    <Typography>{productItem.product.EAN}</Typography>
                  </TableCell>
                  <TableCell
                    color="primary"
                    classes={{
                      root: classes.tablecellroot,
                    }}
                    align="right"
                  >
                    <Typography>{productItem.amount}</Typography>
                  </TableCell>
                  <TableCell
                    color="primary"
                    classes={{
                      root: classes.tablecellroot,
                    }}
                    align="right"
                  >
                    <Typography>{productItem.promotionalPrice < productItem.unitaryValue ? (
                      floatToBRL(productItem.promotionalPrice)
                    ) : (floatToBRL(productItem.unitaryValue))}</Typography>
                  </TableCell>
                  <TableCell
                    color="primary"
                    classes={{
                      root: classes.tablecellroot,
                    }}
                    align="right"
                  >
                    <Typography>{productItem.promotionalPrice < productItem.unitaryValue ? (
                      floatToBRL(productItem.amount * productItem.promotionalPrice)
                    ) : (
                      floatToBRL(productItem.amount * productItem.unitaryValue)
                    )}</Typography>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    )
  }
}

export default withStyles(style)(OrderProductsTable)
