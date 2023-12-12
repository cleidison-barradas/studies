import {
    Avatar,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow,
    withStyles,
} from '@material-ui/core'
import React, { Component } from 'react'
import ProductOrder from '../../../interfaces/productOrder'
import { floatToBRL } from '../../../helpers/moneyFormat'
import style from './style'
import { BucketS3 } from '../../../config'
import Category from '../../../interfaces/category'

type Props = {
    classes: any
    products: ProductOrder[]
}

type State = {
    page: number
    rowsPerPage: number
}

class CustomerDetailTable extends Component<Props, State> {
    constructor(props: any) {
        super(props)
        this.state = {
            page: 0,
            rowsPerPage: 5,
        }
        this.handleChangePage = this.handleChangePage.bind(this)
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this)
    }

    handleChangePage(event: any, newPage: number) {
        this.setState({
            ...this.state,
            page: newPage,
        })
    }

    handleChangeRowsPerPage(event: any) {
        this.setState({
            ...this.state,
            page: 0,
            rowsPerPage: parseInt(event.target.value, 10),
        })
    }
    render() {
        const { classes, products } = this.props
        const { rowsPerPage, page } = this.state
        return (
            <TableContainer>
                <Table
                    classes={{
                        root: classes.table,
                    }}
                >
                    <TableBody>
                        {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((value: ProductOrder) => (
                            <TableRow
                                key={value._id}
                                classes={{
                                    root: classes.tablerow,
                                }}
                            >
                                <TableCell
                                    classes={{
                                        root: classes.tablecell,
                                    }}
                                >
                                    <Grid container spacing={1}>
                                        <Grid item>
                                            <Avatar
                                                variant="rounded"
                                                className={classes.avatar}
                                                src={
                                                    value.product.image
                                                        ? `${BucketS3}${value.product.image.url}`
                                                        : require('../../../assets/images/ilustration/nophoto.jpg')
                                                }
                                            />
                                        </Grid>
                                        <Grid item>{value.product.name}</Grid>
                                    </Grid>
                                </TableCell>
                                <TableCell
                                    classes={{
                                        root: classes.tablecell,
                                    }}
                                    align="left"
                                >
                                    {value.product.EAN}
                                </TableCell>
                                <TableCell
                                    classes={{
                                        root: classes.tablecell,
                                    }}
                                    align="left"
                                >
                                    {value.amount} un
                                </TableCell>
                                <TableCell
                                    classes={{
                                        root: classes.tablecell,
                                    }}
                                    align="center"
                                >

                                    {value.product.category && value.product.category.length > 0
                                        ? value.product.category.map((category: Category) => category.name).join(' , ')
                                        : 'Nenhuma categoria'}

                                </TableCell>
                                <TableCell
                                    classes={{
                                        root: classes.tablecell,
                                    }}
                                    align="right"
                                >
                                    {value.promotionalPrice ? floatToBRL(value.promotionalPrice) : floatToBRL(value.unitaryValue)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={products.length}
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
        )
    }
}

export default withStyles(style)(CustomerDetailTable)
