import { Box, Stack, Typography } from '@mui/material'
import React, { useContext } from 'react'
import { RoundCheckFilledReverse, ClockIcon, RoundCheckUnselected } from '../../assets/icons'
import CartContext from '../../contexts/cart.context'
import { floatToBRL } from '../../helpers/moneyFormat'
import { Card } from './styles'

interface DeliveryOptionProps {
  selected: boolean
  title: string
  time?: React.ReactNode | string
  description: string
  price: number
  onClick?: () => any
}

export const DeliveryOption: React.FC<DeliveryOptionProps> = ({
  selected,
  title,
  time,
  description,
  price,
  onClick,
}) => {
  const { paymentLinkDeliveryFee } = useContext(CartContext)

  return (
    <Card onClick={onClick} selected={selected}>
      <Stack direction="row" width="100%" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box height={24} width={24}>
            {selected ? (
              <RoundCheckFilledReverse className="icon" />
            ) : (
              <RoundCheckUnselected className="icon" />
            )}
          </Box>
          <Typography>{title}</Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography className="icon">{time}</Typography>
          <ClockIcon className="icon" />
        </Stack>
      </Stack>
      <Stack justifyContent="space-between" height="100%" ml={4}>
        <Typography textAlign="left" variant="subtitle1">
          {description}
        </Typography>
        <Typography textAlign="left">
          Frete{' '}
          {paymentLinkDeliveryFee !== undefined && title === 'Delivery local'
            ? floatToBRL(paymentLinkDeliveryFee)
            : price > 0
              ? floatToBRL(price)
              : 'grátis'}{' '}
        </Typography>
      </Stack>
    </Card>
  )
}
