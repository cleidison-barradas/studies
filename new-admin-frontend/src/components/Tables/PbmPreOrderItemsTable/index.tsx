import { Component } from "react"
import { TableContainer, Table, TableHead, TableRow, TableCell, Typography, TableBody, withStyles } from "@material-ui/core"

import styles from './styles'
import { ITransactionItems } from "../../../interfaces/pbm"
import { floatToBRL } from "../../../helpers/moneyFormat"

interface Props {
  items: ITransactionItems[]
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class PbmPreOrderItemsTable extends Component<Props> {

  render() {

    const { classes, items } = this.props

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
                width="25%"
              >
                <Typography className={classes.tableheadtxt}>EAN</Typography>
              </TableCell>
              <TableCell
                color="primary"
                classes={{
                  root: classes.tablecellroot,
                }}
                width="25%"
              >
                <Typography className={classes.tableheadtxt}>nome</Typography>
              </TableCell>
              <TableCell
                color="primary"
                classes={{
                  root: classes.tablecellroot,
                }}
                width="25%"
              >
                <Typography className={classes.tableheadtxt}>Preco</Typography>
              </TableCell>
              <TableCell
                color="primary"
                width="25%"
                classes={{
                  root: classes.tablecellroot,
                }}
              >
                <Typography className={classes.tableheadtxt}>Unidades</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(item => (
              <TableRow key={item.ean}>
                <TableCell
                  color="primary"
                  classes={{
                    root: classes.tablecellroot,
                  }}
                >
                  {item.ean}
                </TableCell>
                <TableCell
                  color="primary"
                  classes={{
                    root: classes.tablecellroot,
                  }}
                >
                  {item.productName}
                </TableCell>
                <TableCell
                  color="primary"
                  classes={{
                    root: classes.tablecellroot,
                  }}
                >
                  {floatToBRL(item.salePrice)}
                </TableCell>
                <TableCell
                  color="primary"
                  classes={{
                    root: classes.tablecellroot,
                  }}
                >
                  {item.approvedQuantity}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    )
  }
}


export default withStyles(styles)(PbmPreOrderItemsTable)