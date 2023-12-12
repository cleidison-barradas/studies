import { Box, Hidden, Stack, Typography } from '@mui/material'
import { Button } from '@mypharma/react-components'
import React, { useContext } from 'react'
import useSWR from 'swr'
import CartContext from '../../contexts/cart.context'
import CheckoutContext from '../../contexts/checkout.context'
import { getDeliverySchedule } from '../../services/delivery/delivery.service'

import { useCart } from '../../hooks/useCart'
import { useInstallments } from '../../hooks/useInstallments'

import { CartProduct } from '../CartProduct'

import { CupomForm } from '../../forms/CupomForm'
import { SelectedAddressCard } from '../SelectedAddressCard'
import MinValueToInstallmentsCard from '../MinValueToInstallmentsCard'

import { floatToBRL } from '../../helpers/moneyFormat'

import { RoundCloseIcon, TicketIcon } from '../../assets/icons'
import { CloseBox, Container, Header, ProductList } from './styles'

interface OrderDetailProps {
  onClose?: () => any
  step: number
}

export const OrderDetail: React.FC<OrderDetailProps> = ({ onClose, step }) => {
  const { cart, fromPaymentLink } = useContext(CartContext)
  const { checkoutAddress, deliveryMode, shipping } = useContext(CheckoutContext)
  const { getCartValue, getDeliveryRegion } = useCart()
  const { isInstallmentsAvaliable } = useInstallments()

  const { discount, subTotal, deliveryFee, total } = getCartValue()
  const deliveryRegion = getDeliveryRegion()
  const { data: deliveryScheduleRequest } = useSWR('deliverySchedule', getDeliverySchedule, {
    revalidateOnFocus: false,
  })

  const virtualProducts = cart.products.filter(({ product }) => product.updateOrigin === 'Docas')

  const hasVirtualProducts = virtualProducts.length > 0

  return (
    <Container>
      <Hidden smUp>
        <Header>
          <TicketIcon />
          <CloseBox onClick={onClose}>
            <p>Fechar</p>
            <RoundCloseIcon />
          </CloseBox>
        </Header>
      </Hidden>
      <Hidden smDown>
        <Typography fontSize={20} fontWeight={500}>
          Detalhes do pedido
        </Typography>
      </Hidden>
      <Stack spacing={4}>
        <ProductList>
          {cart.products?.map(({ product }) => (
            <CartProduct
              removeQuantityButtons={step !== 0 || fromPaymentLink}
              removeDiscount={fromPaymentLink}
              product={product}
              shipping={shipping}
              deliveryFee={deliveryFee}
              address={checkoutAddress}
              region={deliveryRegion}
              deliveryMode={deliveryMode}
              hasVirtualProducts={hasVirtualProducts}
              schedules={deliveryScheduleRequest?.data?.schedule}
              key={product._id}
            />
          ))}
        </ProductList>
        {!isInstallmentsAvaliable() && <MinValueToInstallmentsCard />}
        {checkoutAddress && !!(deliveryMode === 'own_delivery' ? deliveryRegion : shipping) && (
          <SelectedAddressCard
            shipping={shipping}
            address={checkoutAddress}
            region={deliveryRegion}
            deliveryMode={deliveryMode}
            hasVirtualProducts={hasVirtualProducts}
            schedules={deliveryScheduleRequest?.data?.schedule}
          />
        )}
      </Stack>
      <Stack mb={2} mt={3}>
        <Stack direction="row" justifyContent="space-between">
          <Typography>Subtotal:</Typography>
          <Typography>{floatToBRL(subTotal)}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography>Frete:</Typography>
          <Typography>
            {floatToBRL(
              deliveryFee *
                (virtualProducts.length === cart.products.length || virtualProducts.length === 0
                  ? 1
                  : 2)
            )}
          </Typography>
        </Stack>
        {discount > 0 && (
          <Stack direction="row" justifyContent="space-between">
            <Typography> Desconto</Typography>
            <Typography>{floatToBRL(discount)}</Typography>
          </Stack>
        )}
        <Stack direction="row" justifyContent="space-between">
          <Typography fontWeight={500}>Total</Typography>
          <Typography fontWeight={500}>{floatToBRL(total)}</Typography>
        </Stack>
      </Stack>

      <Stack>
        <CupomForm />
        <Hidden smUp>
          <Box mt={3}>
            <Button variant="filled" onClick={onClose}>
              Continuar
            </Button>
          </Box>
        </Hidden>
      </Stack>
    </Container>
  )
}
