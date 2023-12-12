import { Stack, Typography } from '@mui/material'
import React from 'react'
import { useTheme } from 'styled-components'
import { ClockIcon, LocationIcon } from '../../assets/icons'

import Address from '../../interfaces/address'
import Region from '../../interfaces/regions'
import { DeliveryMode } from '../../interfaces/deliveryMode'
import { IShipping } from '../../interfaces/shipping'

import { Card } from './styles'
import { DeliverySchedule } from '../../interfaces/deliverySchedule'

interface SelectedAddressCardProps {
  region?: Region
  price?: string
  address?: Address | null
  shipping?: IShipping | null
  deliveryMode?: DeliveryMode
  schedules?: DeliverySchedule[] | null
  hasVirtualProducts: boolean
}

export type SelectedAddressDeliveries = {
  [key: string]: string
}

export const SelectedAddressCard: React.FC<SelectedAddressCardProps> = ({
  address,
  deliveryMode,
  region,
  shipping,
  children,
  hasVirtualProducts,
  price,
}) => {
  const { color } = useTheme()

  const deliveries: SelectedAddressDeliveries = {
    own_delivery: 'Delivery Local',
    delivery_company: 'Entrega padrão',
    store_pickup: 'Retirar na Loja',
  }

  const shippingTime = shipping?.delivery_range?.max || 0
  const regionTime = region?.deliveryTime || 0

  const time =
    deliveryMode === 'own_delivery'
      ? `${
          hasVirtualProducts
            ? parseInt((regionTime / 60 + (hasVirtualProducts ? 120 : 0)).toString(), 10)
            : regionTime
        } ${hasVirtualProducts && regionTime >= 60 ? 'horas' : 'min'}`
      : `${shippingTime + (hasVirtualProducts ? 3 : 0)} dias`

  return (
    <Card>
      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={1}>
          <LocationIcon color={color.primary.medium} style={{ minHeight: 24 }} />
          <Typography color={color.neutral.dark} fontSize={14}>
            {deliveries[deliveryMode || 'will_decide']}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography noWrap fontSize={14} color="primary">
            {time}
          </Typography>

          <ClockIcon color={color.primary.medium} style={{ minHeight: 24 }} />
        </Stack>
      </Stack>
      <Stack spacing={1} mt={1} ml={4}>
        <Typography color={color.neutral.medium}>
          {address?.neighborhood.city.name} - {address?.neighborhood.city.state.code}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={2} justifyContent="start">
          {children}

          {price && <span>Frete {price}</span>}
        </Stack>
      </Stack>
    </Card>
  )
}
