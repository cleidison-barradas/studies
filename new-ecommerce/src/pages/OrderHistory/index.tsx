import React from 'react'
import { OrderContainer } from '../../components/OrderContainer'
import { MostPurchasedProducts } from '../../components/MostPurchasedProducts'
import { Stack } from '@mui/material'

const OrderHistory: React.FC = () => {
  return (
    <Stack>
      <MostPurchasedProducts />
      <OrderContainer />
    </Stack>
  )
}
export default OrderHistory
