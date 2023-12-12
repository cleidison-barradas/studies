import React from 'react'
import { format } from 'date-fns'
import { AddButton } from '@mypharma/react-components'
import { CDN } from '../../config/keys'
import { Typography, Button } from '@material-ui/core'

import Order from '../../interfaces/order'
import NoImage from '../../assets/ilustration/ProductImageExample.svg'

import { ProductImage, ProductName } from './styles'
import { floatToBRL } from '../../helpers/moneyFormat'
import { useNavigate } from 'react-router'
import { Box } from '@mui/material'

interface OrderProps {
  order: Order
}

export const OrderCard: React.FC<OrderProps> = ({ order }) => {
  const navigate = useNavigate()

  return (
    <Box>
      {order.createdAt && (
        <Typography mb={2}>Data {format(new Date(order.createdAt), 'dd/MM/yyyy')}</Typography>
      )}
      <Box border="1px solid #cdcdcd" borderRadius={5} boxSizing="border-box" padding={2}>
        {order.products.map((product) => (
          <Box
            key={product.product._id}
            display="flex"
            alignItems="center"
            borderBottom="1px solid #cdcdcd"
            mb={2}
            paddingBottom={2}
          >
            <ProductImage
              alt={product.product._id}
              loading="lazy"
              onError={(event) => (event.currentTarget.srcset = `${NoImage}`)}
              src={`${
                product.product.image ? CDN.image?.concat(product.product.image.url) : NoImage
              }`}
            />
            <ProductName>{product.product.name}</ProductName>
          </Box>
        ))}
        <Box
          display="flex"
          paddingBottom={1}
          justifyContent="space-between"
          borderBottom="1px solid #cdcdcd"
        >
          <Box>
            <Typography>{order.statusOrder.name}</Typography>
            <Typography>{order.paymentMethod.paymentOption.name}</Typography>
          </Box>
          <Typography fontWeight="bold">{floatToBRL(order.totalOrder)}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" mt={3} sx={{ button: { width: '45%' } }}>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={() =>
              navigate(`/pedido/${order._id}`)
            }
          >
            Detalhes
          </Button>
          {false ? (
            <AddButton maxWidth disableIncrease={false} value={0} />
          ) : (
            <Button color="secondary" variant="contained" fullWidth>
              Repetir compra
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  )
}
