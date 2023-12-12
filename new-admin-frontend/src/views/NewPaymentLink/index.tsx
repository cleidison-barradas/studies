import React, { Component } from 'react'
import LinkPaper from '../../components/Papers/LinkPaper'
import customerxService from '../../services/customerx.service'
import { ProductConsumer, ProductProvider } from '../../context/ProductContext'
import { RouteComponentProps } from 'react-router-dom'
import { PaymentLinkProvider, PaymentLinksConsumer } from '../../context/PaymentLinkContext'
import { AuthConsumer } from '../../context/AuthContext'

interface Props extends RouteComponentProps {
  mode: string
}

class NewPaymentLink extends Component<Props> {
  componentDidMount() {
    customerxService.trackingScreen()
  }

  render() {
    const { history } = this.props
    return (
      <AuthConsumer>
        {({ store }) => (
          <PaymentLinkProvider>
            <PaymentLinksConsumer>
              {({ createPaymentLink }) => (
                <ProductProvider>
                  <ProductConsumer>
                    {({ getProducts, products, fetching: fetchingProducts }) => (
                      <React.Fragment>
                        <LinkPaper
                          products={products}
                          getProducts={getProducts}
                          fetchingProducts={fetchingProducts}
                          history={history}
                          createPaymentLink={createPaymentLink}
                          store={store}
                        />
                      </React.Fragment>
                    )}
                  </ProductConsumer>
                </ProductProvider>
              )}
            </PaymentLinksConsumer>
          </PaymentLinkProvider>
        )}
      </AuthConsumer>
    )
  }
}

export default NewPaymentLink
