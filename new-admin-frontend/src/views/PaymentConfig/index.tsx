import React, { Component } from 'react'
import CovenantPaper from '../../components/Papers/CovenantPaper'
import GatewaysPaper from '../../components/Papers/GatewaysPaper'
import OnDeliveryPaymentPaper from '../../components/Papers/OnDeliveryPaymentPaper'
import { PaymentMethodsConsumer, PaymentMethodsProvider } from '../../context/PaymentMethodsContext'
import customerxService from '../../services/customerx.service'
import { GatewayMethodProvider, GatewayMethodConsumer } from '../../context/PaymentMethodsContext/Gateway'

interface Props {
  mode: string
}

class PaymentView extends Component<Props> {
  componentDidMount() {
    customerxService.trackingScreen()
  }

  render() {
    return (
      <PaymentMethodsProvider>
        <PaymentMethodsConsumer>
          {({
            requestGetPayments,
            requestdeletePayment,
            requestsavePayment,
            requestPutPix,
            requestGetPaymentOption,
            requestAddNewPaymentOption,
            paymentOptions,
            payments,
          }) => {
            return (
              <React.Fragment>
                <GatewayMethodProvider>
                  <GatewayMethodConsumer>
                    {({
                      getGatewaysMethod,
                      putGatewayMethod,
                      deleteGatewayMethod,
                      gateways
                    }) => (
                      <GatewaysPaper
                        payments={gateways}
                        paymentOptions={paymentOptions}
                        requestGetPaymentOption={requestGetPaymentOption}
                        requestPutPix={requestPutPix}
                        getGatewaysMethod={getGatewaysMethod}
                        putGatewayMethod={putGatewayMethod}
                        deleteGatewayMethod={deleteGatewayMethod}
                      />
                    )}
                  </GatewayMethodConsumer>
                </GatewayMethodProvider>
                <OnDeliveryPaymentPaper
                  requestAddNewPaymentOption={requestAddNewPaymentOption}
                  payments={payments}
                  requestGetPaymentOption={requestGetPaymentOption}
                  requestGetPayments={requestGetPayments}
                  paymentOptions={paymentOptions}
                  requestsavePayment={requestsavePayment}
                  requestdeletePayment={requestdeletePayment}
                />
                <CovenantPaper methods={payments} loadMethods={requestGetPayments} onSave={requestsavePayment} />
              </React.Fragment>
            )
          }}
        </PaymentMethodsConsumer>
      </PaymentMethodsProvider>
    )
  }
}

export default PaymentView
