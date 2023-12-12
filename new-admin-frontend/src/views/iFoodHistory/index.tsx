import React, { Component } from 'react'
import { Box, Button, Grid, Typography, withStyles } from '@material-ui/core'

import { OrderProvider, OrderConsumer } from '../../context/OrderContext'
import styles from './styles'
import PaperBlock from '../../components/PaperBlock'
import IFoodHistoryTable from '../../components/Tables/iFoodHistoryTable'
import IFoodOrder from '../../components/Forms/iFoodOrder'
import customerxService from '../../services/customerx.service'
import { ReportConsumer, ReportProvider } from '../../context/ReportContext'
import ExportiFoodOrderDialog from '../../components/Dialogs/ExportiFoodOrderDialog'
// import SalesFilter from '../../components/SalesFilter'
// import { ifoodOrderStatus } from '../../helpers/ifoodOrdersStatus'

type Props = {
  classes: any
  mode: any
  history: any
}

type State = {
  open: boolean
  reportMonth?: string
}

class IFoodHistory extends Component<Props, State> {
  state: State = {
    open: false,
    reportMonth: '',
  }

  componentDidMount() {
    customerxService.trackingScreen()
  }

  setOpen = (open: boolean) => {
    this.setState({
      ...this.state,
      open,
    })
  }

  render() {
    const {
      classes,
      history,
      mode,
      match: {
        params: { orderCod, orderId },
      },
    }: any = this.props
    const { open } = this.state
    return (
      <OrderProvider>
        <OrderConsumer>
          {({
            requestIFoodOrder,
            fetching,
            ifoodHistory,
            requestIFoodOrderDetail,
            requestDeleteIFoodOrder,
            pagination,
            status,
            requestGetStatusOrder,
          }) => {
            if (orderCod && orderCod !== 'list') {
              return (
                <IFoodOrder
                  history={history}
                  mode={mode}
                  fetching={fetching}
                  loadiFoodOrderDetail={requestIFoodOrderDetail}
                  deleteOrder={requestDeleteIFoodOrder}
                  orderCod={orderCod}
                  orderId={orderId}
                />
              )
            }

            return (
              <React.Fragment>
                <Box mb={4}>
                  <Grid container justify="space-between" alignItems="center">
                    <Grid item>
                      <Typography className={classes.headertxt}>Histórico do iFood</Typography>
                    </Grid>
                    <Grid item>
                      <Button onClick={() => this.setOpen(true)} variant="contained" className={classes.exportbtn}>
                        Exportar vendas
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
                <PaperBlock title="Lista de pedidos">
                  {/* <SalesFilter
                    classes={classes}
                    status={ifoodOrderStatus}
                    loadSalesHistory={requestIFoodOrder}
                    loadStatus={requestGetStatusOrder}
                    type="ifood"
                  /> */}
                  <IFoodHistoryTable
                    fetching={fetching}
                    loadIFoodOrders={requestIFoodOrder}
                    ifoodHistory={ifoodHistory}
                    pagination={pagination}
                  />
                </PaperBlock>
                <ReportProvider>
                  <ReportConsumer>
                    {({ ifoodReports, requestiFoodReports }) => (
                      <ExportiFoodOrderDialog
                        open={open}
                        setOpen={this.setOpen}
                        ifoodReports={ifoodReports}
                        requestiFoodReports={requestiFoodReports}
                      />
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

export default withStyles(styles)(IFoodHistory)
