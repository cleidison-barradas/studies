import React, { Component } from 'react'
import InputMasked from 'react-input-mask'
import classNames from 'classnames'
import moment from 'moment'
import { Box, Divider, Grid, Typography, Input, withStyles, Tooltip } from '@material-ui/core'
import { Link } from 'react-router-dom'

import { Chat, InfoOutlined, LocalShipping } from '@material-ui/icons'
import InstallmentsFeeSubItem from './InstallmentsFeeSubItem'
import PaperBlock from '../../PaperBlock'
import style from './style'

import { ReactComponent as BlueHouse } from '../../../assets/images/icons/blueHouse.svg'
import { ReactComponent as BlueCalendar } from '../../../assets/images/icons/blueCalendar.svg'
import { ReactComponent as BlueCard } from '../../../assets/images/icons/blueCard.svg'
import { ReactComponent as BlueUser } from '../../../assets/images/icons/blueUser.svg'
import { ReactComponent as BlueMail } from '../../../assets/images/icons/blueMail.svg'
import { ReactComponent as BluePhone } from '../../../assets/images/icons/bluePhone.svg'
import { ReactComponent as SyncIcon } from '../../../assets/images/icons/syncIcon.svg'

import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber'

import OrderTable from '../../Tables/OrderTable'
import StatusShipping from '../../StatusShipping'
import OrderProductsTable from '../../Tables/OrderProductsTable'
import CutomerAddressContainer from '../../CutomerAddressContainer'
import CustomerPaymentContainer from '../../CustomerPaymentContainer'
import PbmPreOrderContianer from '../../PbmPreOrderContainer'

import SaleHistory from '../../../interfaces/order'
import Tracking from '../../../interfaces/tracking'
import HistoryOrder from '../../../interfaces/historyOrderStatus'
import { floatToBRL } from '../../../helpers/moneyFormat'
import Store from '../../../interfaces/store'
import { ISender } from '../../../interfaces/sender'
import ExternalIntegrationPaper from '../ExternalIntegrationPaper/ExternalIntegrationPaper'
import { IPbmPreOrder } from '../../../interfaces/pbm'
import { SubmitFiscalDocumentForm, SubmitOrderDispatch } from '../../../interfaces/fiscalDocument'

type Props = {
  mode: any
  store: Store | null
  classes: any
  fetching: boolean
  tracking: string | Tracking[]
  order: SaleHistory
  historyOrder: HistoryOrder[]
  preOrder: IPbmPreOrder | null
  loadTracking: (sender: ISender, trackingCode: string) => Promise<void>
  onSetOrderDispatch: ({ orderDispatch }: SubmitOrderDispatch) => void
  onSetFiscalDocument: ({ fiscalDocument }: SubmitFiscalDocumentForm) => void
}

const DeliveryModeText: Record<string, string> = {
  store_pickup: 'Retirar na Loja',
  own_delivery: 'Entrega própria',
  delivery_company: 'Entrega por transportadora',
}

class OrderPaper extends Component<Props> {
  static defaultProps = {
    fetching: false,
    tracking: [],
    historyOrder: [],
    preOrder: null,
  }

  async componentDidMount() {
    await this.onLoad()
  }

  onLoad = async () => {
    const { order, loadTracking } = this.props

    if (order && order.trackingCode && order.trackingCode.length > 0 && !order.sender.includes('not_selected')) {
      await loadTracking(order.sender, order.trackingCode)
    }
  }

  render() {
    const { classes, order, store, fetching, historyOrder, tracking, preOrder, onSetFiscalDocument, onSetOrderDispatch } = this.props
    const {
      customer,
      totalOrder = 0,
      deliveryMode,
      deliveryData,
      createdAt,
      paymentMethod,
      paymentCode,
      moneyChange = 0,
      healthInsurance,
      shippingOrder = null,
      products = [],
      trackingCode,
      comment = '',
      cupom,
      externalMarketplace = null,
      prefix,
      branchPickup,
    } = order

    const storeName = store?.name || store?.settings.config_name || ''
    const phone = customer?.phone || ''
    const email = customer?.email || ''
    const fullName = customer?.fullName || customer?.firstname.concat(' ', customer.lastname) || ''
    const deliveryFee = deliveryData?.feePrice || 0
    const addresses = customer?.addresses || []
    const document = order.cpf || customer?.cpf || ''
    const payment_installments = paymentMethod?.details?.payment_installments ?? 1
    const installmentsFee = paymentMethod?.details?.payment_quota ?? 0
    const totalOrderWithInstallmentFee = totalOrder + installmentsFee
    const externalMarketplaceName = externalMarketplace?.name

    let productsBlockTitle = order.products.length>1 ? 'Produtos' : 'Produto'
    let switchToRelatedOrderText  = 'Ver detalhes dos itens do estoque '

    if (order.stock === 'virtual') {
      productsBlockTitle += ' Estoque Virtual'
      switchToRelatedOrderText  += 'Físico'
    } else {
      productsBlockTitle += ' Estoque Físico'
      switchToRelatedOrderText  += 'Virtual'
    }

    return (
      <Grid container className={classes.onPrint} spacing={2}>
        <Grid item lg={8} md={8} sm={12} xs={12}>
          <div>
            <PaperBlock className={classes.onPrint} title="Informações do pedido">
              {branchPickup ? (
                <Box mb={1}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item>
                      <BlueHouse />
                    </Grid>
                    <Grid item>
                      <Box display="flex">
                        <Typography style={{ marginRight: '10px' }}>{`Filial - ${branchPickup.name.toUpperCase()}`}</Typography>
                        <Typography>{`${branchPickup.address.street} ${branchPickup.address.number || ''}, ${branchPickup.address.neighborhood.city.name
                          } - ${branchPickup.address.neighborhood.city.state.name}`}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              ) : (
                <Box mb={1}>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item>
                      <BlueHouse />
                    </Grid>
                    <Grid item>
                      <Typography>{externalMarketplaceName ?? storeName}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
              <Box mb={1}>
                <Grid container spacing={2}>
                  <Grid item>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>
                        <BlueCalendar />
                      </Grid>
                      <Grid item>
                        <Typography>{moment(createdAt).calendar()}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
              <Box mb={1}>
                <Grid container spacing={2}>
                  <Grid item>
                    <Box display="flex">
                      <LocalShipping color="primary" style={{ marginRight: 5 }} />
                      <Typography>{DeliveryModeText[deliveryMode]}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <BlueCard />
                </Grid>
                <Grid item>
                  <CustomerPaymentContainer
                    payment={paymentMethod}
                    paymentCode={paymentCode}
                    moneyChange={moneyChange}
                    covenantName={healthInsurance}
                  />
                </Grid>
                <Grid container alignItems="center" spacing={1}>
                  {document.length > 0 && (
                    <>
                      <Grid item>
                        <BlueUser />
                      </Grid>
                      <Grid item>
                        <InputMasked mask="999.999.999-99" value={document} disabled>
                          {(props: any) => <Input {...props} type="tel" classes={{ root: classes.cpfInput }} disableUnderline />}
                        </InputMasked>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Grid>
              {comment && comment.length > 0 && (
                <Box>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item>
                      <Chat color="primary" style={{ width: 21, height: 20 }} />
                    </Grid>
                    <Grid item>
                      <Typography>Obs: {comment}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
              {cupom && (
                <Box mt={1} mb={1}>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item>
                          <ConfirmationNumberIcon color="primary" />
                        </Grid>
                        <Grid item>
                          <Typography>{cupom.name} :{cupom.code}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </PaperBlock>
          </div>
          {prefix?.toLowerCase() === 'pluggto' ? (
            <ExternalIntegrationPaper
              isPluggto
              order={order}
              type={['invoice', 'shipping']}
              onSetOrderDispatch={onSetOrderDispatch}
              onSetFiscalDocument={onSetFiscalDocument}
            />
          ) : preOrder ? (
            <ExternalIntegrationPaper
              order={order}
              type={["invoice"]}
              onSetOrderDispatch={onSetOrderDispatch}
              onSetFiscalDocument={onSetFiscalDocument}
            />
          )
            : null
          }
          <div>
            <CutomerAddressContainer
              address={addresses[0]}
              shipping={shippingOrder}
              deliveryMode={deliveryMode}
              trackingCode={trackingCode}
            />
          </div>
          {deliveryMode.includes('delivery_company') && (
            <div className={classes.noPrint}>
              <StatusShipping order={order} tracking={tracking} />
            </div>
          )}
          <div>
            <PaperBlock className={classes.onPrint} title={productsBlockTitle}>
              <OrderProductsTable products={products} />
              <Box mt={1} mb={2}>
                <Divider />
              </Box>
              <Box mb={2}>
                <Grid container justify="space-between">
                  <Grid item>
                    <Typography className={classes.title}>Sub-total</Typography>
                  </Grid>
                  <Grid item>
                    <Typography className={classes.value}>{floatToBRL(totalOrder - deliveryFee)}</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box mb={2}>
                <Grid container justify="space-between">
                  <Grid item>
                    <Typography className={classes.title}>Frete</Typography>
                  </Grid>
                  <Grid item>
                    <Typography className={classes.value}>{floatToBRL(deliveryFee)}</Typography>
                  </Grid>
                </Grid>
              </Box>
              {(installmentsFee > 0
                && paymentMethod.paymentOption.name === 'Stone')
                ? (<InstallmentsFeeSubItem installmentsFeeValue={installmentsFee} />)
                : null
              }
              <Box>
                <Grid container justify="space-between">
                  <Grid item>
                    <Typography className={classNames(classes.title, classes.boldPrint)}>Total</Typography>
                  </Grid>
                  <Grid item>
                    {
                      ((payment_installments > 1) && (payment_installments <= 24))
                        ? (
                          <Typography className={classNames(classes.value, classes.boldPrint)}>{
                            floatToBRL(totalOrderWithInstallmentFee)} (em {payment_installments}x de {floatToBRL((totalOrderWithInstallmentFee / payment_installments))})
                          </Typography>
                        ) : (
                          <Typography className={classNames(classes.value, classes.boldPrint)}>
                            {floatToBRL(totalOrderWithInstallmentFee)}
                          </Typography>
                        )
                    }
                  </Grid>
                </Grid>
              </Box>
            </PaperBlock>
            {(
              order.relatedOrderId &&
              <Box>
                <Link to={`/sale/${order.relatedOrderId}`} style={{textDecoration:'none'}}>
                <Typography className={classNames(classes.siwtchToRelatedOrderText)}>
                  {switchToRelatedOrderText } <SyncIcon />
                </Typography>
                </Link>
              </Box>
            )}
          </div>
        </Grid>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <Box>
            <PaperBlock className={classes.onPrint} title="Informações do cliente">
              <Box mb={1}>
                <Grid container spacing={1}>
                  <Grid item>
                    <BlueUser />
                  </Grid>
                  <Grid item>
                    <Typography className={classes.boldPrint}>{fullName}</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box mb={1}>
                <Grid container spacing={1}>
                  <Grid item>
                    <BlueMail />
                  </Grid>
                  <Grid item>
                    <Typography className={classes.boldPrint}>{email}</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Grid container spacing={1}>
                <Grid item>
                  <BluePhone />
                </Grid>
                <Grid item>
                  <Typography className={classes.boldPrint}>{phone}</Typography>
                </Grid>
              </Grid>
            </PaperBlock>
            <Box height="100%">
              <PaperBlock title="Histórico">
                <OrderTable fetching={fetching} historyStatus={historyOrder} />
              </PaperBlock>
              {preOrder && (
                <PaperBlock>
                  <Grid container alignItems="center">
                    <Typography>Status Pré Venda (PBM)</Typography>
                    <Box ml={1}>
                      <Tooltip title="Para que a venda de produtos com PBM seja efetivada é obrigatório enviar os dados de NFe/CFe">
                        <InfoOutlined />
                      </Tooltip>
                    </Box>
                  </Grid>
                  <PbmPreOrderContianer preOrder={preOrder} />
                </PaperBlock>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(style)(OrderPaper)