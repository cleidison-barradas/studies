import useSWR from 'swr'
import { Typography, Box } from '@mui/material'
import { useParams } from 'react-router'
import { Search } from '@mui/icons-material'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { GetOrders } from '../../services/order/order.service'
import { OrderDetailContainer } from '../../components/OrderDetailContainer'

const OrderDetail: React.FC = () => {
  const { orderId } = useParams()
  const [searchParams] = useSearchParams()

  const isVirtual = searchParams.get('v')
  const [refreshInterval, setRefreshInterval] = useState(3000) // fetch order request each 3 seconds

  const { data: request } = useSWR(`order/${orderId}`, async () => await GetOrders(orderId), {
    refreshInterval,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
  })

  const { data } = useSWR(`orders`, () => GetOrders())

  const isValid = isVirtual ? data?.orders && request?.order : request?.order
  const virtual = data?.orders?.find(({ relatedOrderId }) => relatedOrderId === orderId)

  useEffect(() => {
    if (request && request.order) setRefreshInterval(60000)
  }, [request])

  return isValid ? (
    <>
      {!!isVirtual && <OrderDetailContainer order={virtual} />}
      {<OrderDetailContainer order={request?.order} mixed />}
    </>
  ) : (
    <Box display="flex" flexDirection="column" alignItems="center" mt={30}>
      <Typography fontSize={20} fontWeight="bold">
        Buscando pedido aguarde...
      </Typography>
      <Search sx={{ fontSize: 120 }} color="primary" />
    </Box>
  )
}
export default OrderDetail
