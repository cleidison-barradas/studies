import { withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router'
// Papers
import UpdateOrderPaper from '../../components/UpdateOrderPaper'
// Contexts
import { OrderProvider, OrderConsumer } from '../../context/OrderContext'
import { SnackbarConsumer } from '../../context/SnackbarContext'

import styles from './styles'

interface OrderViewProps {
  orderId: string
}

interface Props extends RouteComponentProps<OrderViewProps> {
  mode: any
}

class UpdateOrderView extends Component<Props> {
  render() {
    const {
      match: {
        params: { orderId },
      },
      mode,
    } = this.props
    return (
      <OrderProvider>
        <OrderConsumer>
          {({
            store,
            status,
            success,
            fetching,
            tracking,
            preOrder,
            saleHistory,
            historyOrders,
            requestGetOrderDetail,
            requestGetStatusOrder,
            requestGetStatusHistory,
            requestAlterOrder,
            requestPutOrderDispatch,
            requestPutOrderFiscalDocument,
            requestPbmPreOrder

          }) => (
            <SnackbarConsumer>
              {({ openSnackbar }) => (
                <UpdateOrderPaper
                  {...this.props}
                  mode={mode}
                  store={store}
                  status={status}
                  success={success}
                  orderId={orderId}
                  order={saleHistory}
                  tracking={tracking}
                  fetching={fetching}
                  preOrder={preOrder}
                  openSnackbar={openSnackbar}
                  historyOrder={historyOrders}
                  onUpdate={requestAlterOrder}
                  loadOrder={requestGetOrderDetail}
                  loadStatus={requestGetStatusOrder}
                  loadHistory={requestGetStatusHistory}
                  onSetFiscalDocument={requestPutOrderFiscalDocument}
                  onSetOrderDispatch={requestPutOrderDispatch}
                  requestPbmPreOrder={requestPbmPreOrder}
                />
              )}
            </SnackbarConsumer>
          )}
        </OrderConsumer>
      </OrderProvider>
    )
  }
}

export default withStyles(styles)(UpdateOrderView)
