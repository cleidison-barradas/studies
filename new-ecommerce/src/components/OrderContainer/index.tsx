import React from 'react'
import { OrderCard } from '../OrderCard'
import { EmptyOrderContainer } from '../EmptyOrderContainer'
import { Box, Grid } from '@mui/material'
import useSWR from 'swr'
import Order from '../../interfaces/order'
import { GetOrders } from '../../services/order/order.service'

export const OrderContainer: React.FC = () => {
  const { data: request } = useSWR(`orders`, () => GetOrders())

  const isValid = request?.orders && request.orders.length > 0

  return (
    <Box display="flex" mt={5}>
      {!isValid && <EmptyOrderContainer />}

      {isValid && (
        <Grid
          container
          spacing={2}
          gridTemplateColumns="repeat(3, 1fr)"
          columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 3 }}
          rowSpacing={1}
        >
          {request?.orders?.map((order: Order) => (
            <Grid item mt={3} xs={12} sm={6} md={6} lg={4} xl={4} key={order._id}>
              <OrderCard key={order._id} order={order} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}
