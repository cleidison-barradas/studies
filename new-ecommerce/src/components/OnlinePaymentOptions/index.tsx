import React, { useEffect, useState } from 'react'
import { ArrowForwardIos } from '@mui/icons-material'
import { Stack, Typography } from '@mui/material'
import { OptionButton } from './styles'
import { useTheme } from 'styled-components'
import PaymentMethod from '../../interfaces/paymentMethod'
import { BoletoIcon, CardIcon, PicpayIcon, PixIcon } from '../../assets/icons'
import { getPaymentMethods } from '../../services/payment/payment.service'
import useSWR from 'swr'
import { DeliveryMode } from '../../interfaces/deliveryMode'
import User from '../../interfaces/user'
import { CompleteCheckout } from '../CompleteCheckout'

interface OnlinePaymentOptionsProps {
  user: User | null
  deliveryMode?: DeliveryMode
  hasVirtualProducts?: boolean
  acceptedOnlineMethods?: string[]
  acceptedPickupMethods?: string[]
  setSelectedPayment: React.Dispatch<React.SetStateAction<PaymentMethod | null>>
}

const paymentOptionIcon: Record<string, React.ReactNode> = {
  pix: <PixIcon height={20} width={20} color={'inherit'} />,
  picpay: <PicpayIcon height={24} width={24} color={'inherit'} />,
  pagseguro: <CardIcon height={24} width={24} color={'inherit'} />,
  stone: <CardIcon height={24} width={24} color={'inherit'} />,
  boleto: <BoletoIcon height={24} width={24} color="inherit" />,
}

export const OnlinePaymentOptions: React.FC<OnlinePaymentOptionsProps> = ({
  user,
  setSelectedPayment,
  hasVirtualProducts,
  deliveryMode = 'own_delivery',
  acceptedPickupMethods = ['pix', 'picpay', 'stone'],
  acceptedOnlineMethods = ['gateway', 'ticket'],
}) => {
  const { color } = useTheme()
  const [completeCheckout, setComplete] = useState(false)
  const { data: paymentRequest } = useSWR('paymentMethods', getPaymentMethods)
  const missingDocument = user ? !user.cpf || user.cpf.length <= 0 : false

  useEffect(() => {
    if (missingDocument) {
      setComplete(true)
    }
  }, [missingDocument])

  const paymentMethods = paymentRequest
    ? paymentRequest.paymentMethods.filter((method) => {
        const { paymentOption } = method

        if (deliveryMode.includes('store_pickup')) {
          return acceptedPickupMethods.includes(paymentOption.name.toLowerCase())
        }

        return acceptedOnlineMethods.includes(paymentOption.type)
      })
    : []

  const parsePaymentOptionName = (name: string) => {
    const parse: Record<string, string> = {
      pagseguro: 'Cartão de crédito',
      stone: 'Cartão de crédito',
    }

    if (name in parse) {
      return parse[name]
    }

    return name
  }

  const virtualPayOnline = ['stone']

  return (
    <Stack mt={3} spacing={2}>
      {completeCheckout ? (
        <CompleteCheckout onUpdate={() => setComplete(false)} cpfRequired />
      ) : paymentMethods.length > 0 ? (
        (hasVirtualProducts
          ? paymentMethods.filter(({ paymentOption: { name } }) => virtualPayOnline.includes(name.toLocaleLowerCase()))
          : paymentMethods
        ).map((payment) => (
          <OptionButton onClick={() => setSelectedPayment(payment)} key={payment._id}>
            <Stack color={color.neutral.darkest} alignItems="center" spacing={2} direction="row">
              {paymentOptionIcon[payment.paymentOption.name.toLowerCase()]}
              <Typography fontSize={14}>
                {parsePaymentOptionName(payment.paymentOption.name.toLowerCase())}
              </Typography>
            </Stack>
            <ArrowForwardIos fontSize={'small'} color={'primary'} />
          </OptionButton>
        ))
      ) : null}
    </Stack>
  )
}
