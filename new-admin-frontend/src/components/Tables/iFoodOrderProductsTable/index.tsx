import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import style from './style'
import { floatToBRL } from '../../../helpers/moneyFormat'
import { IFoodProduct } from '../../../interfaces/ifood'

type Props = {
  classes: any
  products: IFoodProduct[] | undefined
}

class IFoodOrderProductsTable extends Component<Props> {
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
                <Typography className={classes.tableheadtxt}>Nome:</Typography>
              </TableCell>
              <TableCell
                color="primary"
                classes={{
                  root: classes.tablecellroot,
                }}
                align="right"
              >
                <Typography className={classes.tableheadtxt}>EAN:</Typography>
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
            {products !== undefined && products?.length > 0
              ? products?.map((productItem) => (
                  <TableRow key={productItem.id}>
                    <TableCell
                      color="primary"
                      classes={{
                        root: classes.tablecellroot,
                      }}
                    >
                      {productItem.produto}
                    </TableCell>
                    <TableCell
                      color="primary"
                      classes={{
                        root: classes.tablecellroot,
                      }}
                    >
                      {productItem.codigoBarra}
                    </TableCell>
                    <TableCell
                      color="primary"
                      classes={{
                        root: classes.tablecellcenter,
                      }}
                      align="right"
                    >
                      {productItem.quantidade}
                    </TableCell>
                    <TableCell
                      color="primary"
                      classes={{
                        root: classes.tablecellroot,
                      }}
                      align="right"
                    >
                      {floatToBRL(productItem.valor)}
                    </TableCell>
                    <TableCell
                      color="primary"
                      classes={{
                        root: classes.tablecellroot,
                      }}
                      align="right"
                    >
                      {floatToBRL(productItem.valorTotal)}
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }
}

export default withStyles(style)(IFoodOrderProductsTable)
