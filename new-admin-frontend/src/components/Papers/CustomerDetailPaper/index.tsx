import { Box, Grid, Typography, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import PaperBlock from '../../PaperBlock'

import { ReactComponent as BlueCalendar } from '../../../assets/images/icons/blueCalendar.svg'
// import { ReactComponent as BlueCard } from '../../../assets/images/icons/blueCard.svg'
import { ReactComponent as BlueUser } from '../../../assets/images/icons/blueUser.svg'
import { ReactComponent as BlueMail } from '../../../assets/images/icons/blueMail.svg'
import { ReactComponent as BluePhone } from '../../../assets/images/icons/bluePhone.svg'
import { ReactComponent as BlueLocation } from '../../../assets/images/icons/blueLocation.svg'
import style from './style'
import CustomerDetailTable from '../../Tables/CustomerDetailTable'
import Customer from '../../../interfaces/customer'
import LoadingContainer from '../../LoadingContainer'
import moment from 'moment'
import { PublicAddress as publicAddress } from '../../../interfaces/publicAddress'
import ProductOrder from '../../../interfaces/productOrder'

type Props = {
    classes: any
    mode: any
    fetching: any
    getCustomer: (...args: any) => void
    customer: Customer | null
    id: Customer['_id']
    products: ProductOrder[]
    getOrderProducts: (...args: any) => void
}

class CustomerDetailPaper extends Component<Props> {
    componentDidMount() {
        this.load()
    }

    load = async (data?: any) => {
        const { getCustomer, id, getOrderProducts } = this.props
        await Promise.all([getCustomer(data, id), getOrderProducts(id)])
    }

    render() {
        const { classes, fetching, customer, products } = this.props
        return (
            <>
                <Grid container spacing={3}>
                    <Grid item lg={8} md={8} sm={12} xs={12}>
                        <PaperBlock title="Informações do Cliente">
                            {fetching ? (
                                <LoadingContainer />
                            ) : (
                                <Grid container spacing={2}>
                                    <Grid item lg={5} md={6} sm={12} xs={12}>
                                        <Grid container>
                                            <Grid item lg={8} sm={12} md={12} xs={12}>
                                                {/*
                                                    <Grid
                                                        container
                                                        justify="space-between"
                                                    >
                                                        <Grid item>
                                                            <Typography className={classes.field} >Tipo</Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <Typography className={classes.value} >1º Compra</Typography>
                                                        </Grid>
                                                    </Grid>
                                                        */}
                                            </Grid>
                                            <Grid item lg={8} sm={12} md={12} xs={12}>
                                                <Grid container justify="space-between">
                                                    <Grid item>
                                                        <Typography className={classes.field}>Status</Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        <Typography className={classes.value}>{customer?.status ? 'Habilitado' : 'Desabilitado'}</Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item lg={8} sm={12} md={12} xs={12}>
                                                {/*
                                                    <Grid
                                                        container
                                                        justify="space-between"
                                                    >
                                                        <Grid item>
                                                            <Typography className={classes.field} >IP</Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <Typography className={classes.value} >009.217.205.209</Typography>
                                                        </Grid>
                                                    </Grid>
                                                        */}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item lg={7} md={6} sm={12} xs={12}>
                                        <Grid container>
                                            <Grid item lg={8} sm={12} md={12} xs={12}>
                                                <Grid
                                                    container
                                                    alignItems="center"
                                                    justify={window.innerWidth < 600 ? 'space-between' : 'flex-start'}
                                                    spacing={1}
                                                >
                                                    <Grid item>
                                                        <Grid container alignItems="center" spacing={1}>
                                                            <Grid item>
                                                                <BlueCalendar />
                                                            </Grid>
                                                            <Grid item>
                                                                <Typography className={classes.field} style={{ marginTop: 4 }}>
                                                                    Cadastro
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item style={{ paddingTop: 8 }}>
                                                        <Typography className={classes.value}>{moment(customer?.createdAt).calendar()} </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item lg={8} sm={12} md={12} xs={12}>
                                                <Grid
                                                    container
                                                    alignItems="center"
                                                    justify={window.innerWidth < 600 ? 'space-between' : 'flex-start'}
                                                    spacing={1}
                                                >
                                                    {/*
                                                        <Grid item>
                                                            <Grid
                                                                container
                                                                alignItems="center"
                                                                spacing={1}
                                                            >
                                                                <Grid item>
                                                                    <BlueCard />
                                                                </Grid>
                                                                <Grid item>
                                                                    <Typography className={classes.field} style={{ marginTop: 4 }} >Finalização de Compra</Typography>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item>
                                                            <Typography className={classes.value} style={{ marginTop: 4 }} > Comprou por Checkout Site </Typography>
                                                        </Grid>
                                                            */}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            )}
                        </PaperBlock>
                    </Grid>
                    <Grid item lg={4} md={4} sm={12} xs={12}>
                        <PaperBlock title="Dados Pessoais">
                            {fetching ? (
                                <LoadingContainer />
                            ) : (
                                <>
                                    <Grid container alignItems="center" spacing={1}>
                                        <Grid item>
                                            <BlueUser />
                                        </Grid>
                                        <Grid item>
                                            <Typography>
                                                {' '}
                                                {customer?.firstname} {customer?.lastname}{' '}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container alignItems="center" spacing={1}>
                                        <Grid item>
                                            <BlueMail />
                                        </Grid>
                                        <Grid item>
                                            <Typography> {customer?.email} </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container alignItems="center" spacing={1}>
                                        <Grid item>
                                            <BluePhone />
                                        </Grid>
                                        <Grid item>
                                            <Typography> {customer?.phone} </Typography>
                                        </Grid>
                                    </Grid>
                                </>
                            )}
                        </PaperBlock>
                    </Grid>
                </Grid>
                <Box mt={3}>
                    <PaperBlock title="Endereços Salvos">
                        {fetching ? (
                            <LoadingContainer />
                        ) : (
                            customer?.addresses.map((address: publicAddress) => (
                                <Grid container key={address._id} spacing={2} alignItems="center">
                                    <Grid item lg={5} md={8} xs={12} sm={12}>
                                        <Grid container alignItems="center" spacing={0}>
                                            <Grid item>
                                                <Grid container alignItems="center" spacing={3}>
                                                    <Grid item>
                                                        <BlueLocation />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item>
                                                <Typography>
                                                    {address.street}, {address.neighborhood.name} , {address.neighborhood.city.name}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            ))
                        )}
                    </PaperBlock>
                </Box>
                <Box mt={3}>
                    <PaperBlock title="Produtos comprados">
                        {fetching ? <LoadingContainer /> : <CustomerDetailTable products={products} />}
                    </PaperBlock>
                </Box>
            </>
        )
    }
}

export default withStyles(style)(CustomerDetailPaper)
