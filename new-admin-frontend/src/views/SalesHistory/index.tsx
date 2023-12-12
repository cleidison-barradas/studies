import React, { Component } from 'react'
import { Box, Button, Grid, Typography, withStyles } from '@material-ui/core'
import PaperBlock from '../../components/PaperBlock'

import HistoryTableList from '../../components/Tables/SalesHistoryTable'

import { OrderProvider, OrderConsumer } from '../../context/OrderContext'
import style from './style'
import ExportOrderDialog from '../../components/Dialogs/ExportOrderDialog'
import { ReportConsumer, ReportProvider } from '../../context/ReportContext'
import customerxService from '../../services/customerx.service'
import { PaymentMethodsConsumer, PaymentMethodsProvider } from '../../context/PaymentMethodsContext'
import { RouteComponentProps } from 'react-router-dom'

interface Props extends RouteComponentProps {
  classes: any
  mode: any
}

type State = {
  open: boolean
}

class SalesHistory extends Component<Props, State> {
  state: State = {
    open: false,
  }

  setOpen = (open: boolean) => {
    this.setState({
      ...this.state,
      open,
    })
  }

  componentDidMount() {
    customerxService.trackingScreen()
  }

  render() {
    const { classes } = this.props

    const { open } = this.state

    return (
      <OrderProvider>
        <OrderConsumer>
          {({
            status,
            pagination,
            fetching,
            salesHistory,
            requestDeleteOrder,
            requestGetStatusOrder,
            requestGetSalesHistory,
          }) => {
            return (
              <React.Fragment>
                <Box mb={4}>
                  <Grid container justify="space-between" alignItems="center">
                    <Grid item>
                      <Typography className={classes.headertxt}>Histórico de Vendas</Typography>
                    </Grid>
                    <Grid item>
                      <Button onClick={() => this.setOpen(true)} variant="contained" className={classes.exportbtn}>
                        Exportar vendas
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
                <PaperBlock title="Lista de pedidos">
                  <PaymentMethodsProvider>
                    <PaymentMethodsConsumer>
                      {({ requestGetPayments, payments }) => (
                        <HistoryTableList
                          status={status}
                          classes={classes}
                          fetching={fetching}
                          pagination={pagination}
                          salesHistory={salesHistory}
                          onDelete={requestDeleteOrder}
                          loadHistoryOrders={requestGetSalesHistory}
                          loadOrderStatus={requestGetStatusOrder}
                          methods={payments}
                          getPaymentMethods={requestGetPayments}
                        />
                      )}
                    </PaymentMethodsConsumer>
                  </PaymentMethodsProvider>
                </PaperBlock>
                <ReportProvider>
                  <ReportConsumer>
                    {({ requestgetReport }) => (
                      <ExportOrderDialog open={open} setOpen={this.setOpen} onSubmit={requestgetReport} />
                    )}
                  </ReportConsumer>
                </ReportProvider>
              </React.Fragment>
            )
          }}
        </OrderConsumer>
      </OrderProvider>
    )
  }
}

export default withStyles(style)(SalesHistory)
