import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

import { Box, Button, CircularProgress, Grid, IconButton, Typography, withStyles } from '@material-ui/core'
// Form Context
import { Form, Formik } from 'formik'
// Validation
import * as yup from 'yup'
import styles from './styles'

// interfaces
import HistoryOrderStatus from '../../interfaces/historyOrderStatus'
import OrderStatus from '../../interfaces/orderStatus'
import Order from '../../interfaces/order'
// Components
import CustomDialogOrderStatus from '../CustomDialogOrderStatus'
import OrderFormPaper from '../Papers/OrderPaper'
import CustomDialog from '../CustomDialog'
// Assets
import { ReactComponent as BlueBackIcon } from '../../assets/images/icons/blueBackArrow.svg'

import { IPbmPreOrder } from '../../interfaces/pbm'
import Tracking from '../../interfaces/tracking'
import Store from '../../interfaces/store'

import { ApiShippingConsumer, ApiShippingProvider } from '../../context/ApiShipping'

import { RequestPutOrderDispatch, RequestPutOrderFiscalDocument } from '../../services/api/interfaces/ApiRequest'
import { SubmitFiscalDocumentForm, SubmitOrderDispatch } from '../../interfaces/fiscalDocument'

interface RequestGetOrders {
  orderId?: string | null
  order?: string | null
}

interface AlterOrderResquest {
  statusOrder: OrderStatus['_id'] | null
  notify: boolean
  comments?: string
  trackingCode?: string
}

interface Props extends RouteComponentProps {
  mode: any
  store: Store | null
  orderId: string
  success: boolean
  fetching: boolean
  order: Order | null
  tracking: Tracking[]
  status: OrderStatus[]
  historyOrder: HistoryOrderStatus[]
  preOrder: IPbmPreOrder | null
  loadStatus: () => void
  loadOrder: (id: string) => void
  loadHistory: (data?: RequestGetOrders) => void
  onUpdate: (id: string, data: AlterOrderResquest) => void
  requestPbmPreOrder: (orderId: string) => void
  onSetOrderDispatch: ({ orderId, orderDispatch }: RequestPutOrderDispatch) => void
  onSetFiscalDocument: ({ orderId, fiscalDocument }: RequestPutOrderFiscalDocument) => void
  classes: Record<keyof ReturnType<typeof styles>, string>
  openSnackbar: (message: string, severity?: "error" | "info" | "success" | "warning" | undefined) => void
}

interface State {
  modal: {
    open: boolean
    title: string
    footer: any
    dividers: boolean
  }
}

class UpdateOrderPaper extends Component<Props, State> {
  static defaultProps = {
    status: [],
    success: false,
    fetching: false,
    historyOrder: [],
    preOrder: null
  }

  state: State = {
    modal: {
      open: false,
      title: 'Alterar status do pedido',
      footer: null,
      dividers: false,
    },
  }

  onLoad = () => {
    const { loadOrder, loadStatus, loadHistory, requestPbmPreOrder, orderId } = this.props

    if (orderId) {
      loadOrder(orderId)
      loadHistory({ order: orderId })
      requestPbmPreOrder(orderId)
    }
    loadStatus()
  }

  componentDidMount() {
    this.onLoad()
  }

  componentDidUpdate(prevProps: { orderId: string }) {
    if (this.props.orderId !== prevProps.orderId) {
      this.onLoad()
    }
  }

  schemaValidation = yup.object().shape({
    statusOrder: yup.string().required('Defina um status').nullable(true),
    trackingCode: yup.string().nullable(true),
    notify: yup.boolean(),
    comments: yup.string(),
  })

  handleModal = () => {
    const state = this.state
    state.modal.open = !state.modal.open

    this.setState(state)
  }

  handleSubmit = (data: AlterOrderResquest) => {
    const { orderId, success, onUpdate, openSnackbar } = this.props

    if (orderId) {
      onUpdate(orderId, data)
    }

    if (success) openSnackbar('Pedido alterado com sucesso !')

    setTimeout(() => {
      this.onLoad()
    }, 1200)
    this.handleModal()
  }

  handleSetOrderDispatch = ({ orderDispatch }: SubmitOrderDispatch) => {
    const { orderId, loadHistory, requestPbmPreOrder, onSetOrderDispatch } = this.props

    if (orderId) {
      onSetOrderDispatch({ orderId, orderDispatch })

      setTimeout(() => {
        requestPbmPreOrder(orderId)
        loadHistory({ order: orderId })
      }, 1000)
    }

  }

  handleSetFiscalDocument = ({ fiscalDocument }: SubmitFiscalDocumentForm) => {
    const { orderId, loadHistory, requestPbmPreOrder, onSetFiscalDocument } = this.props

    if (orderId) {
      onSetFiscalDocument({ orderId, fiscalDocument })

      setTimeout(() => {
        requestPbmPreOrder(orderId)
        loadHistory({ order: orderId })
      }, 1000)
    }
  }


  render() {
    const { mode, store, order, orderId, fetching, history, status, historyOrder, preOrder, classes } = this.props
    const { modal: { open, footer, title } } = this.state

    return (
      <Box>
        {!fetching && order ? (
          <React.Fragment>
            <Box mt={2} mb={2}>
              <Grid container spacing={2} alignItems="center" justify="space-between">
                <Grid item lg={6} md={12} sm={12} xs={12}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item className={classes.noPrint}>
                      <Link to={`/sales/list`} style={{textDecoration:'none'}}>
                        <IconButton
                          classes={{
                            root: classes.gobackbtn,
                          }}
                          onClick={() => history.goBack()}
                        >
                          <BlueBackIcon />
                        </IconButton>
                      </Link>
                    </Grid>
                    <Grid item>
                      <Typography className={classNames(classes.headertxt, classes.boldPrint)}>Pedido ({orderId})</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={6} md={12} sm={12} xs={12} className={classes.noPrint}>
                  <Grid container spacing={2} justify={window.innerWidth > 1200 ? 'flex-end' : 'flex-start'}>
                    <Grid item xl={3} lg={4} md={12} sm={12} xs={12}>
                      <Button fullWidth variant="contained" classes={{ contained: classes.printf }} onClick={() => window.print()}>
                        Imprimir pedido
                      </Button>
                    </Grid>
                    <Grid item xl={4} lg={5} md={12} sm={12} xs={12}>
                      <Button fullWidth variant="contained" color="primary" onClick={this.handleModal}>
                        Alterar status do Pedido
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
            <Formik
              onSubmit={this.handleSubmit}
              initialValues={{
                comments: '',
                notify: false,
                statusOrder: null,
                trackingCode: '',
              }}
              validationSchema={this.schemaValidation}
              enableReinitialize
            >
              {({ submitForm }) => (
                <ApiShippingProvider>
                  <ApiShippingConsumer>
                    {({ requestGetShippingStatus, tracking }) => (
                      <Form>
                        <OrderFormPaper
                          store={store}
                          mode={mode}
                          order={order}
                          fetching={fetching}
                          tracking={tracking}
                          historyOrder={historyOrder}
                          preOrder={preOrder}
                          loadTracking={requestGetShippingStatus}
                          onSetOrderDispatch={this.handleSetOrderDispatch}
                          onSetFiscalDocument={this.handleSetFiscalDocument}
                        />
                        {open && (
                          <CustomDialog
                            open={open}
                            footer={footer}
                            dividers={false}
                            title={title}
                            paperWidthSm={classes.paperWidthSm}
                            closeModal={() => null}
                            content={() => (
                              <CustomDialogOrderStatus
                                order={order}
                                status={status}
                                deliveryMode={order?.deliveryMode}
                                closeModal={this.handleModal}
                                onSave={submitForm}
                              />
                            )}
                          />
                        )}
                      </Form>
                    )}
                  </ApiShippingConsumer>
                </ApiShippingProvider>
              )}
            </Formik>
          </React.Fragment>
        ) : (
          <Grid container spacing={2} alignItems='center' direction='column'>
            <CircularProgress size={60} />
            <Typography color='secondary' variant='h5'>Aguardando informações do pedido...</Typography>
          </Grid>
        )}
      </Box>
    )
  }
}

export default withStyles(styles)(UpdateOrderPaper)