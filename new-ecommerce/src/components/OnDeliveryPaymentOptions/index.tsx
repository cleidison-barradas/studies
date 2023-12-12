import { ArrowForwardIos } from '@mui/icons-material'
import { Stack, Typography } from '@mui/material'
import React from 'react'
import { useTheme } from 'styled-components'
import { OptionButton } from './styles'
import { CardIcon, HandShakeIcon, MoneyIcon } from '../../assets/icons'
import useSWR from 'swr'
import { getPaymentMethods } from '../../services/payment/payment.service'
import PaymentMethod from '../../interfaces/paymentMethod'
import { DeliveryMode } from '../../interfaces/deliveryMode'

interface Props {
  deliveryMode: DeliveryMode
  acceptedOnlineMethods?: string[]
  setSelectedPayment: React.Dispatch<React.SetStateAction<PaymentMethod | null>>
}

const paymentTypeIcon: Record<string, React.ReactNode> = {

  credit: <CardIcon height={24} width={24} color={'inherit'} />,
  debit: <CardIcon height={24} width={24} color={'inherit'} />,
  money: <MoneyIcon height={24} width={24} color={'inherit'} />,
  covenant: <HandShakeIcon height={24} width={24} color={'inherit'} />
}

export const OnDeliveryPaymentOptions: React.FC<Props> = ({ acceptedOnlineMethods = ['gateway', 'ticket'], setSelectedPayment }) => {
  const { data } = useSWR('paymentMethods', getPaymentMethods)
  const { color } = useTheme()

  const paymentMethods = data ? data.paymentMethods.filter(method => !acceptedOnlineMethods.includes(method.paymentOption.type)) : []

  return (
    <Stack mt={4} spacing={2}>
      {paymentMethods.length > 0 && (
        paymentMethods.map(method => (
          <OptionButton onClick={() => setSelectedPayment(method)} key={method._id}>
            <Stack color={color.neutral.darkest} alignItems="center" spacing={2} direction="row">
              {paymentTypeIcon[method.paymentOption.type.toLowerCase()]}

              <Typography fontSize={14}>
                {method.paymentOption.name}
                {method.paymentOption.type.toLowerCase() === 'debit' || method.paymentOption.type.toLowerCase() === 'credit'
                  ? ' ( Maquininha )'
                  : ''}
              </Typography>
            </Stack>
            <ArrowForwardIos fontSize={'small'} color={'primary'} />
          </OptionButton>

        ))
      )}
    </Stack>
  )
}
