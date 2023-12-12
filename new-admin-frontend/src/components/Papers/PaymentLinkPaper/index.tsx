import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { Component } from 'react'
import { ConfirmDialogConsumer, ConfirmDialogProvider } from '../../../context/ConfirmDialogContext'
import PaymentLink from '../../../interfaces/paymentLink'
import PaperBlock from '../../PaperBlock'

import SuportLink from '../../SuportLink'
import PaymentLinksTable from '../../Tables/PaymentLinksTable'
import EmptyPaymentLink from '../EmptyPaymentLink'
import style from './style'
import Pagination from '../../../interfaces/pagination'
import CustomDialogViewPaymentLink from '../../CustomDialogViewPaymentLink'
import PaymentLinkInformationsResponse from '../../../interfaces/paymentLinkInformationsResponse'
import { LinearProgress, withStyles } from '@material-ui/core'

type Props = {
  classes: any
  paymentLinks: PaymentLink[]
  createNew: () => void
  getPaymentLinks: (...args: any) => void
  fetching: any
  count: number
  pagination: Pagination
  getCartByPaymentLink: (...args: any) => Promise<PaymentLinkInformationsResponse>
  deletePaymentLink: (_id: string) => Promise<void>
}

type State = {
  modalViewLinkOpened: boolean
  selectedPaymentLinkId: string
  filters: {
    createdAt: MaterialUiPickersDate
    page: number
    limit: number
  }
}

class PaymentLinkPaper extends Component<Props, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      modalViewLinkOpened: false,
      selectedPaymentLinkId: '',
      filters: {
        page: 0,
        createdAt: null,
        limit: 5,
      },
    }
    this.handleChangePage = this.handleChangePage.bind(this)
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this)
  }

  load = async (data?: any) => {
    const { getPaymentLinks } = this.props
    const {
      filters: { page, limit },
    } = this.state
    await getPaymentLinks({ page: page + 1, limit, ...data })
  }

  componentDidMount() {
    this.load()
  }

  setFilters = (value: any, field: any) => {
    this.setState(
      (state) => ({
        ...state,
        filters: {
          ...state.filters,
          [field]: value,
        },
      }),
      () => {
        this.load(this.state.filters)
      }
    )
  }

  handleChangePage(event: any, newPage: number) {
    this.setState(
      {
        ...this.state,
        filters: {
          ...this.state.filters,
          page: newPage,
        },
      },
      async () => {
        await this.load()
      }
    )
  }

  handleChangeRowsPerPage(event: any) {
    this.setState(
      {
        ...this.state,
        filters: {
          ...this.state.filters,
          page: 0,
          limit: parseInt(event.target.value, 10),
        },
      },
      async () => {
        await this.load()
      }
    )
  }
  setSelectedPaymentLinkId = (id: string) => {
    this.setState({
      ...this.state,
      selectedPaymentLinkId: id,
    })
  }

  render() {
    const { paymentLinks, getPaymentLinks, fetching, createNew, pagination, getCartByPaymentLink } = this.props
    const {
      filters: { page, limit },
    } = this.state
    return (
      <div>
        {paymentLinks.length === 0 && !fetching ? (
          <EmptyPaymentLink createNew={createNew} />
        ) : (
          <PaperBlock title="Todos os Links de Pagamento">
            {fetching && <LinearProgress />}
            <ConfirmDialogProvider>
              <ConfirmDialogConsumer>
                {({ openDialog, closeDialog }) => (
                  <PaymentLinksTable
                    deletePaymentLink={this.props.deletePaymentLink}
                    paymentLinks={paymentLinks}
                    getPaymentLinks={getPaymentLinks}
                    handleChangePage={this.handleChangePage}
                    handleChangeRowsPerPage={this.handleChangeRowsPerPage}
                    pagination={pagination}
                    rowsPerPage={limit}
                    page={page}
                    openDialog={openDialog}
                    closeDialog={closeDialog}
                    onOpenDialogViewLink={() => this.setState({ modalViewLinkOpened: true })}
                    setSelectedPaymentLinkId={(id: string) => this.setSelectedPaymentLinkId(id)}
                  />
                )}
              </ConfirmDialogConsumer>
            </ConfirmDialogProvider>
            <SuportLink query="televendas" />
          </PaperBlock>
        )}

        <CustomDialogViewPaymentLink
          open={this.state.modalViewLinkOpened}
          onClose={() => this.setState({ modalViewLinkOpened: false })}
          getCartByPaymentLink={getCartByPaymentLink}
          paymentLinkId={this.state.selectedPaymentLinkId}
        />
      </div>
    )
  }
}

export default withStyles(style)(PaymentLinkPaper)
