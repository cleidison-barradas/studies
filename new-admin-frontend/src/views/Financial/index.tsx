import { Component } from 'react'
import Financial from '../../components/Financial'
import { FinancialConsumer, FinancialProvider } from '../../context/FinancialContext'
import { SnackbarConsumer } from '../../context/SnackbarContext'
import { StoreConsumer, StoreProvider } from '../../context/StoreContext'
import customerxService from '../../services/customerx.service'

interface Props {
  mode: string
}

class FinancialView extends Component<Props> {
  componentDidMount() {
    customerxService.trackingScreen()
  }

  render() {
    return (
      <StoreProvider>
        <StoreConsumer>
          {({ store }) => (
            <FinancialProvider>
              <FinancialConsumer>
                {({ findCustomer, findInvoicesPending, customer, invoices, findIssuedNfes }) => (
                  <SnackbarConsumer>
                    {({ openSnackbar }) => (
                      <Financial
                        store={store}
                        loadCustomer={findCustomer}
                        loadInvoices={findInvoicesPending}
                        loadNfes={findIssuedNfes}
                        customer={customer}
                        invoices={invoices}
                        openSnackbar={openSnackbar}
                      />
                    )}
                  </SnackbarConsumer>
                )}
              </FinancialConsumer>
            </FinancialProvider>
          )}
        </StoreConsumer>
      </StoreProvider>
    )
  }
}

export default FinancialView
