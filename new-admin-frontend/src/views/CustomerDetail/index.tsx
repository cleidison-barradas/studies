import { Box, Grid, IconButton, Typography, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import Customer from '../../interfaces/customer'
import { ReactComponent as BlueBackArrow } from '../../assets/images/icons/blueBackArrow.svg'
import style from './style'
import CustomerDetailPaper from '../../components/Papers/CustomerDetailPaper'
import { CustomerConsumer, CustomerProvider } from '../../context/CustomerContext'
import ReportProblemIcon from '@material-ui/icons/ReportProblem'
import customerxService from '../../services/customerx.service'

type Props = {
    classes: any
    mode: any
    _id: Customer['_id']
    history: any,
    match: any
}

class CustomerDetail extends Component<Props> {

    componentDidMount() {
        customerxService.trackingScreen()
    }

    render() {
        const { classes, mode, history, match: { params: { _id } } } = this.props

        return (
            <CustomerProvider>
                <CustomerConsumer>
                    {({ customer, getCustomers, fetching, getOrderProducts, products, error }) => (
                        <>
                            <Box mb={3} mt={3}>
                                <Grid container justify="space-between">
                                    <Grid item>
                                        <Grid container alignItems="center" spacing={2}>
                                            <Grid item>
                                                <IconButton
                                                    classes={{
                                                        root: classes.backbtn,
                                                    }}
                                                    onClick={() => history.goBack()}
                                                >
                                                    <BlueBackArrow />
                                                </IconButton>
                                            </Grid>
                                            <Grid item>
                                                <Typography className={classes.headertxt}>{customer?.firstname} {customer?.lastname}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    {/*
                                        <Grid item>
                                            <Button variant="contained" color="primary">
                                                imprimir detalhes
                                            </Button>
                                        </Grid>
                                        */}
                                </Grid>
                            </Box>
                            {error === 'customer_not_found' ? (
                                <div className={classes.emptycontainer}>
                                    <ReportProblemIcon className={classes.emptyicon} />
                                    <Typography className={classes.emptytext}>Cliente não encontrado</Typography>
                                </div>
                            ) : (
                                <CustomerDetailPaper
                                    mode={mode}
                                    getCustomer={getCustomers}
                                    customer={customer}
                                    fetching={fetching}
                                    id={_id}
                                    getOrderProducts={getOrderProducts}
                                    products={products}
                                />
                            )}
                        </>
                    )}
                </CustomerConsumer>
            </CustomerProvider>
        )
    }
}

export default withStyles(style)(CustomerDetail)
