import { Box, Typography } from '@mui/material'
import { isBefore } from 'date-fns'
import React from 'react'
import Order from '../../interfaces/order'
import { BoletoInfo } from '../BoletoInfo'
import { PicpayInfo } from '../PicpayInfo'
import { PixPayInfo } from '../PixPayInfo'

interface OrderDetailPayProps {
  order: Order
}

export const OrderDetailPay: React.FC<OrderDetailPayProps> = ({ order }) => {
  const { statusOrder, paymentMethod: { paymentOption }, extras = [] } = order

  if (statusOrder.type !== 'pending') return <React.Fragment />

  if (paymentOption.type === 'gateway' && paymentOption.name.toLowerCase().includes('picpay') && extras.length > 0 && isBefore(new Date(), new Date(extras[0]?.expiresAt))) {
    return (
      <Box>
        <Typography fontSize={20} textAlign="center">
          Ainda não pagou?
        </Typography>
        <PicpayInfo qrCodeSrc={order.extras[0].qrcode.base64} url={order.extras[0].paymentUrl} />
      </Box>
    )
  }

  if (paymentOption.type === 'gateway' && paymentOption.name.toLowerCase().includes('pix') && extras.length > 0 && isBefore(new Date(), new Date(extras[0].expiresAt))) {
    return (
      <React.Fragment>
        <Box>
          <Typography fontSize={20} textAlign="center">
            Ainda não pagou?
          </Typography>
          <PixPayInfo qrcodeSrc={order.extras[0].imagemQrcode} code={order.extras[0].qrcode} />
        </Box>
      </React.Fragment>
    )
  }

  if (paymentOption.type === 'ticket' && extras.length > 0) {
    return (
      <Box mb={3}>
        <Typography mb={1} fontSize={20} textAlign="center">
          Ainda não pagou?
        </Typography>
        <BoletoInfo pdfUrl={order.extras[0]} barcodeUrl={order.extras[1]} paycode={order.extras[3]} />
      </Box>
    )
  }

  return <React.Fragment />
}
