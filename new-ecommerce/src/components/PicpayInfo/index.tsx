import { Typography, Stack, Link } from '@mui/material'
import React from 'react'
import { PicpayQRCodeImage } from './styles'

interface PicpayInfoProps {
  qrCodeSrc: string
  url: string
}

export const PicpayInfo: React.FC<PicpayInfoProps> = ({ qrCodeSrc, url }) => {
  return (
    <React.Fragment>
      <Typography textAlign="center" fontSize={18}>
        Pague o seu pedido usando o Picpay!
      </Typography>
      <Typography textAlign="center" fontSize={16}>
        Abra o PicPay em seu telefone e escaneie o código abaixo
      </Typography>
      <Stack alignItems="center" justifyContent="center">
        <PicpayQRCodeImage src={qrCodeSrc} alt={'picpay qrcode'} />
      </Stack>
      <Typography textAlign="center" fontSize={16}>
        ou use o
        <Link pl={1} href={url} target="_blank" rel="noopener noreferrer">
          link do aplicativo
        </Link>
      </Typography>
    </React.Fragment>
  )
}
