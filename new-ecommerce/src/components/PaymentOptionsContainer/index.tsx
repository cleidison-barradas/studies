import { Box, Divider, Stack, Typography } from '@mui/material'
import {
  BackArrowIcon,
  BoletoIcon,
  CardIcon,
  HandShakeIcon,
  MoneyIcon,
  PicpayIcon,
  PixIcon,
} from '../../assets/icons'
import React from 'react'
import { useTheme } from 'styled-components'
import { GoBackButton } from '../Menu/styles'
import { getPaymentMethods } from '../../services/payment/payment.service'
import useSWR from 'swr'

interface PaymentOptionsContainerProps {
  onClose: () => void
}

export const PaymentOptionsContainer: React.FC<PaymentOptionsContainerProps> = ({ onClose }) => {
  const { color } = useTheme()
  const { data: paymentOptionsRequest } = useSWR('paymentMethods', getPaymentMethods)

  const paymentTypeIcon: any = {
    credit: <CardIcon height={24} width={24} color={'inherit'} />,
    debit: <CardIcon height={24} width={24} color={'inherit'} />,
    money: <MoneyIcon height={24} width={24} color={'inherit'} />,
    covenant: <HandShakeIcon height={24} width={24} color={'inherit'} />,
  }

  const paymentOptionIcon: any = {
    pix: <PixIcon height={24} width={24} color={'inherit'} />,
    picpay: <PicpayIcon height={24} width={24} color={'inherit'} />,
    pagseguro: <CardIcon height={24} width={24} color={'inherit'} />,
    stone: <CardIcon height={24} width={24} color={'inherit'} />,
    boleto: <BoletoIcon height={24} width={24} color={'inherit'} />,
  }

  const parsePaymentOptionName = (name: string) => {
    const parse: any = {
      pagseguro: 'Cartão de crédito',
      stone: 'Cartão de crédito',
    }

    if (name in parse) {
      return parse[name]
    }

    return name
  }

  return (
    <React.Fragment>
      <GoBackButton onClick={onClose}>
        <Stack direction="row" alignItems="center" spacing={4}>
          <BackArrowIcon color={color.neutral.darkest} height={16} width={16} />
          <Stack alignItems="flex-start">
            <Typography fontSize={18}> Formas de Pagamento </Typography>
            <Typography color={color.neutral.medium}> Como pagar minhas compras </Typography>
          </Stack>
        </Stack>
      </GoBackButton>
      <React.Fragment>
        {
          // online
        }
        <Box mb={4}>
          <Stack mb={2} direction="row" alignItems="center" spacing={2}>
            <Typography fontSize={18}>Online</Typography>
            <Divider style={{ flex: 1 }} />
          </Stack>
          <Stack spacing={2}>
            {paymentOptionsRequest?.paymentMethods
              ?.filter(({ paymentOption }) => paymentOption.type === 'gateway' || paymentOption.type === 'ticket')
              .map(({ paymentOption }) => (
                <Stack
                  key={paymentOption._id}
                  alignItems="center"
                  direction="row"
                  color={color.neutral.darkest}
                  spacing={2}
                >
                  {paymentOptionIcon[paymentOption.name.toLowerCase()]}
                  <Typography fontSize={16}>
                    {parsePaymentOptionName(paymentOption.name.toLowerCase())}
                  </Typography>
                </Stack>
              ))}
          </Stack>
        </Box>
        {
          // entrega
        }
        <Stack mb={2} direction="row" alignItems="center" spacing={2}>
          <Typography fontSize={18}>Na entrega</Typography>
          <Divider style={{ flex: 1 }} />
        </Stack>
        <Stack spacing={2}>
          {paymentOptionsRequest?.paymentMethods
            ?.filter(({ paymentOption }) => paymentOption.type !== 'gateway' && paymentOption.type !== 'ticket')
            .map(({ paymentOption }) => (
              <Stack
                key={paymentOption._id}
                alignItems="center"
                direction="row"
                color={color.neutral.darkest}
                spacing={2}
              >
                {paymentTypeIcon[paymentOption.type.toLowerCase()]}

                <Stack alignItems="center" direction="row" spacing={1}>
                  <Typography fontSize={16}>{paymentOption.name}</Typography>

                  {paymentOption.type.toLowerCase() === 'debit' || paymentOption.type.toLowerCase() === 'credit' ? (
                    <Typography fontSize={12} variant="subtitle1">
                      ( Maquininha )
                    </Typography>
                  ) : undefined}
                </Stack>
              </Stack>
            ))}
        </Stack>
      </React.Fragment>
    </React.Fragment>
  )
}
