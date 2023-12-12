import React, { useContext, useEffect, useMemo } from 'react'
import { Box, Hidden, Stack } from '@mui/material'
import { Grid, Typography } from '@material-ui/core'
import {
  DeliveryDiningOutlined,
  MailOutline,
  ShoppingBagOutlined,
  LocalShippingOutlined,
} from '@mui/icons-material'
import { OrderHelpButtons } from '../OrderHelpButtons'
import { Inventory as InventoryIcon } from '@mui/icons-material'
import AuthContext from '../../contexts/auth.context'

import { OrderDetailPay } from '../OrderDetailPay'

import Order from '../../interfaces/order'
import { PaymentType } from '../../interfaces/PaymentType'
import { DeliveryMode } from '../../interfaces/deliveryMode'

import { floatToBRL } from '../../helpers/moneyFormat'
import { isUsingInstalled } from '../../helpers/isUsingInstalled'

import StatusSteps from '../StatusSteps'
import { CDN } from '../../config/keys'

import NoImage from '../../assets/ilustration/ProductImageExample.svg'
import { ImgProduct, OrderCard } from './styles'
import { IPaymentCode } from '../../interfaces/paymentCode'
interface OrderDetailProps {
  order?: Order
  mixed?: boolean
}

export const OrderDetailContainer: React.FC<OrderDetailProps> = ({ order, mixed }) => {
  const { store } = useContext(AuthContext)
  const isInstalled = isUsingInstalled()
  const userAgent = useMemo(() => navigator.userAgent, [])

  const waitTimeMS = 120000

  useEffect(() => {
    if (isInstalled && (userAgent.match(/safari/i) || /android/i.test(userAgent))) {
      const interval = setInterval(() => {
        window.location.reload()
      }, waitTimeMS)
      return () => clearInterval(interval)
    }
  }, [isInstalled, userAgent])

  function paymentText(type: PaymentType) {
    switch (type) {
      case 'debit':
        return 'Débito'
      case 'credit':
        return 'Crédito'
      case 'money':
        return 'Dinheiro'
      case 'covenant':
        return 'Convênio'
      case 'ticket':
        return 'Boleto'
      default:
        return ''
    }
  }

  function paymentCodeText(code: IPaymentCode) {
    switch (code) {
      case 'pay_online':
        return 'Pagamento online'

      case 'pay_on_delivery':
        return 'Pagar na entrega'

      default:
        break
    }
  }

  function deliveryModeText(deliveryMode: DeliveryMode, data: Order) {
    if (data && store) {
      const { trackingCode } = data
      const { config_address, config_store_number, config_store_city, config_cep } = store.settings
      const storeAddress = data.branchPickup
        ? [
            data.branchPickup.address.street,
            data.branchPickup.address.number,
            ', ',
            data.branchPickup.address.neighborhood.city.name,
            ' - ',
            data.branchPickup.address.neighborhood.city.state.name,
            data.branchPickup.address.postcode || '',
          ].join(' ')
        : [config_address, config_store_number, config_store_city, config_cep].join(' ')

      switch (deliveryMode) {
        case 'delivery_company':
          return `Entrega por Transportadora ${
            trackingCode && trackingCode.length > 0 ? 'Código de Rastreio ' + trackingCode : ''
          }`

        case 'store_pickup':
          if (data.branchPickup) {
            return 'Retirar na loja ' + data.branchPickup.name.toUpperCase() + ' - ' + storeAddress
          }
          return `Retirar na loja ${storeAddress}`

        default:
          return 'Entrega Local'
      }
    }
  }

  if (order) {
    const {
      _id,
      statusOrder,
      paymentMethod,
      comment,
      deliveryMode,
      customer,
      products,
      deliveryData = { feePrice: 0 },
      totalOrder = 0,
      paymentCode,
    } = order
    const payment_installments = paymentMethod.details?.payment_installments
      ? paymentMethod.details?.payment_installments
      : 1
    const { feePrice } = deliveryData
    return (
      <React.Fragment>
        <Box mt={3}>
          <Typography fontSize={20} mb={3} fontWeight="bold">
            Seu Pedido Nº {_id}
          </Typography>
          <Grid spacing={5} container>
            <Grid item xs={12} sm={12} lg={7} md={12}>
              <Stack gap={3}>
                <OrderCard>
                  <Typography fontWeight="bold">{statusOrder.name}</Typography>
                  <Box display="flex" justifyContent="space-between">
                    <Typography>
                      {paymentCodeText(order.paymentCode)}{' '}
                      {paymentText(paymentMethod.paymentOption.type)}
                    </Typography>
                    <Typography>
                      {paymentMethod.paymentOption.name.toLowerCase().includes('pagseguro') ||
                      paymentMethod.paymentOption.name.toLowerCase().includes('stone')
                        ? 'Cartão de crédito online'
                        : paymentMethod.paymentOption.name}
                      {` ${payment_installments > 1 ? `Parcelado` : ''}`}
                    </Typography>
                  </Box>
                </OrderCard>
                <OrderCard>
                  <Typography fontWeight="bold"> Observação </Typography>
                  <Box display="flex" justifyContent="space-between">
                    <Typography>{comment}</Typography>
                  </Box>
                </OrderCard>
                <OrderCard>
                  <Grid container spacing={3}>
                    <Grid item display="flex" alignItems="center" xs={12} lg={12} md={12} sm={12}>
                      {deliveryMode.includes('store_pickup') ? (
                        <Stack direction="row" spacing={1}>
                          <InventoryIcon />
                          <Typography fontSize={14}>Retirar na loja</Typography>
                        </Stack>
                      ) : (
                        <React.Fragment>
                          <DeliveryDiningOutlined color="error" style={{ marginRight: 10 }} />
                          <Typography fontWeight="bold" marginRight={1}>
                            Entregar em:
                          </Typography>
                          <Box
                            display="flex"
                            alignItems="center"
                            sx={{ display: window.innerWidth < 700 ? 'column' : 'flex' }}
                          >
                            {customer.addresses.map((address) => (
                              <Box display="flex" key={address._id}>
                                <Typography fontSize={14} marginRight={1}>
                                  {address.street} {address.number || `S/N`}{' '}
                                  {address.complement || ''}
                                  {address.neighborhood.name}, {address.neighborhood.city.name} -
                                  {address.neighborhood.city.state.name}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </React.Fragment>
                      )}
                    </Grid>
                    <Grid item>
                      <StatusSteps status={statusOrder} paymentCode={paymentCode} />
                    </Grid>
                  </Grid>
                </OrderCard>
                <OrderDetailPay order={order} />
                {mixed && (
                  <Hidden lgDown>
                    <OrderHelpButtons />
                  </Hidden>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12} sm={12} lg={5} md={12}>
              <Grid container>
                <Grid item xs={12} sm={12} lg={12} md={12}>
                  <OrderCard>
                    {products.map((product) => (
                      <Box mt={1} mb={3} key={product.product._id}>
                        <Box display="flex" alignItems="center">
                          <ImgProduct
                            alt={product.product._id}
                            loading="lazy"
                            onError={(event) => (event.currentTarget.srcset = `${NoImage}`)}
                            src={
                              product.product.image
                                ? `${CDN.image?.concat(product.product.image.url)}`
                                : NoImage
                            }
                          />
                          <Typography>{product.product.name}</Typography>
                        </Box>
                        <Box
                          display="flex"
                          alignItems="center"
                          mt={2}
                          justifyContent="space-between"
                        >
                          <Box
                            display="flex"
                            justifyContent="center"
                            width={110}
                            padding={1}
                            borderRadius={8}
                            border="1px solid #787878"
                          >
                            <Typography>{product.amount}</Typography>
                          </Box>
                          <Typography>
                            {Number(product.promotionalPrice) < Number(product.unitaryValue)
                              ? floatToBRL(product.amount * product.promotionalPrice)
                              : floatToBRL(product.amount * product.unitaryValue)}
                          </Typography>
                        </Box>
                      </Box>
                    ))}

                    <Box mt={5} borderTop="1px solid #CDCDCD">
                      <Stack gap={2} mt={2}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography>SubTotal</Typography>
                          <Typography>{floatToBRL(totalOrder - feePrice)}</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography>Frete</Typography>
                          <Typography>{floatToBRL(feePrice)}</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography fontWeight="bold">Total</Typography>
                          <Typography fontWeight="bold">
                            {payment_installments > 1 && payment_installments <= 24 ? (
                              <Typography>
                                {floatToBRL(totalOrder)} (em {payment_installments}x de{' '}
                                {floatToBRL(totalOrder / payment_installments)}){' '}
                              </Typography>
                            ) : (
                              <Typography>{floatToBRL(totalOrder)}</Typography>
                            )}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                  </OrderCard>
                </Grid>
                {mixed && (
                  <>
                    <Grid item xs={12} sm={12} lg={12} md={12} marginTop={5}>
                      <Grid container>
                        <Grid
                          item
                          display="flex"
                          alignItems="flex-start"
                          xs={12}
                          sm={12}
                          lg={12}
                          md={12}
                        >
                          <MailOutline
                            color="action"
                            fontSize="large"
                            style={{ marginRight: 15 }}
                          />
                          <Box>
                            <Typography fontWeight={400} color="#333" fontSize={16}>
                              Como acompanhar a entrega
                            </Typography>
                            <Typography>
                              Enviamos um e-mail com link para esta página, aqui você pode
                              acompanhar a evolução da entrega.
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid
                          item
                          display="flex"
                          alignItems="flex-start"
                          marginTop={5}
                          xs={12}
                          sm={12}
                          lg={12}
                          md={12}
                        >
                          <ShoppingBagOutlined
                            color="action"
                            fontSize="large"
                            style={{ marginRight: 15 }}
                          />
                          <Box>
                            <Typography fontWeight={400} color="#333" fontSize={16}>
                              Informações da Compra
                            </Typography>
                            <Typography fontWeight={400} fontSize={16} color="#333" marginTop={1}>
                              E-mail
                            </Typography>
                            <Typography fontWeight={400} fontSize={12}>
                              {customer.email}
                            </Typography>
                            {deliveryData && (
                              <Typography fontWeight={400} fontSize={16} color="#333" marginTop={1}>
                                Endereço de Cobrança e Entrega
                              </Typography>
                            )}
                            <Typography fontWeight={400} fontSize={12}>
                              {customer.fullName}
                            </Typography>
                            <Typography fontWeight={400} fontSize={12}>
                              {customer.phone}
                            </Typography>
                            {!deliveryMode.includes('store_pickup') &&
                              customer.addresses.map((address) => (
                                <Typography key={address._id} fontWeight={400} fontSize={12}>
                                  {address.street}, {address.number || 'S/N'}, {address.postcode}{' '}
                                  <br />
                                  {address.neighborhood.name}, {address.neighborhood.city.name},
                                  {address.neighborhood.city.state.name}
                                </Typography>
                              ))}
                          </Box>
                        </Grid>
                        <Grid
                          item
                          display="flex"
                          alignItems="center"
                          marginTop={5}
                          gap={2}
                          xs={12}
                          sm={12}
                          lg={12}
                          md={12}
                        >
                          <LocalShippingOutlined color="action" fontSize="large" />

                          <Typography fontWeight={400} fontSize={16} color="#333">
                            {deliveryModeText(deliveryMode, order)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Hidden lgUp>
                      <OrderHelpButtons />
                    </Hidden>
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </React.Fragment>
    )
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={30}>
      <Typography fontSize={20} fontWeight="bold">
        Pedido não encontrado !
      </Typography>
    </Box>
  )
}
