/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Stack, SwipeableDrawer, Typography, Button } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { RoundCloseIcon } from '../../assets/icons'
import CartContext from '../../contexts/cart.context'
import {
  CloseButton,
  DrawerBody,
  DrawerContainer,
  DrawerFooter,
  DrawerHeader,
  SectionContainer,
} from './styles'

import { useCart } from '../../hooks/useCart'
import { useNavigate } from 'react-router'
import { CartProduct } from '../CartProduct'
import { EmptyCardIlustration } from '../../assets/ilustration'
import { useTheme } from 'styled-components'
import { CardDeliveryFeeCaption } from '../CardDeliveryFeeCaption'
import { waypointContext } from '../../contexts/waypoint.context'
import { floatToBRL } from '../../helpers/moneyFormat'

export const CartDrawer: React.FC = () => {
  const { shouldRenderOptionals } = useContext(waypointContext)
  const { open, setOpen, cart, setProceedCheckout } = useContext(CartContext)
  const { getCartValue, getDeliveries } = useCart()
  const [minimumPurchase, setMinimumPurchase] = useState(0)
  const navigate = useNavigate()
  const { color } = useTheme()

  const closeDrawer = () => {
    setOpen(false)
    setProceedCheckout(true)
  }

  const { discount = 0, subTotal = 0 } = getCartValue()
  const deliveries: any = getDeliveries()

  const getMinimumPurchase = () => {
    const orderByMinimumPurchase = deliveries.sort(
      (a: any, b: any) => a?.minimumPurchase - b?.minimumPurchase
    )

    return orderByMinimumPurchase![0]?.minimumPurchase || minimumPurchase
  }

  useEffect(() => {
    setMinimumPurchase(getMinimumPurchase())
  }, [deliveries, subTotal])


  const canProceed = minimumPurchase === 0 || subTotal >= minimumPurchase
  const virtualProducts = cart.products.filter(({ product }) => product.updateOrigin === 'Docas')
  const isDocks = virtualProducts.length !== 0
  const isEmpty = cart.products?.length === 0

  const storeProducts = cart.products.filter(({ product }) => product.updateOrigin !== 'Docas')

  return (
    <SwipeableDrawer onOpen={() => setOpen(true)} open={open} onClose={closeDrawer} anchor="right">
      <DrawerContainer>
        <DrawerHeader style={{ color: color.headerTextColor }}>
          <CloseButton onClick={closeDrawer}>
            <RoundCloseIcon />
          </CloseButton>
          <p>Cesta de Compras</p>
        </DrawerHeader>
        <DrawerBody>
          {!isEmpty && (shouldRenderOptionals || open) && (
            <CardDeliveryFeeCaption
              isDocks={isDocks}
              storeProducts={storeProducts}
              virtualProducts={virtualProducts}
            />
          )}

          {isEmpty ? (
            <Stack mt={6} spacing={4}>
              <EmptyCardIlustration color={color.primary.medium} height={250} />
              <Stack spacing={1}>
                <Typography textAlign="center" fontSize={24} fontWeight="bold">
                  Ops, ainda não tem produtos na cesta!
                </Typography>
                <Typography textAlign="center" fontSize={14}>
                  Adicione produtos na cesta de compra.
                </Typography>
              </Stack>
            </Stack>
          ) : (
            cart.products?.map(({ product }) => <CartProduct product={product} key={product._id} />)
          )}

          {!isEmpty && (
            <SectionContainer>
              <Stack direction="row" justifyContent="space-between">
                <Typography>
                  <strong>Subtotal</strong> (sem frete):
                </Typography>
                <Typography fontWeight="bold">{floatToBRL(subTotal)}</Typography>
              </Stack>
              {discount > 0 && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography>Desconto</Typography>
                  <Typography style={{ textDecoration: 'line-through' }}>
                    {floatToBRL(discount)}
                  </Typography>
                </Stack>
              )}
            </SectionContainer>
          )}
        </DrawerBody>
        <DrawerFooter>
          {!isEmpty && (
            <Stack direction="row" justifyContent="space-between">
              <Typography fontWeight="bold">Total</Typography>
              <Stack direction="row" alignItems="center" gap={1}>
                <Typography fontWeight="bold">{floatToBRL(subTotal - discount)}</Typography>
              </Stack>
            </Stack>
          )}

          <Box mt={2}>
            {!isEmpty && (
              <Button
                color="secondary"
                variant="contained"
                fullWidth
                disableElevation
                disabled={!canProceed}
                onClick={() => {
                  navigate('/checkout')
                  closeDrawer()
                }}
              >
                {!canProceed
                  ? `PEDIDO MÍNIMO A PARTIR DE ${floatToBRL(minimumPurchase)}`
                  : 'Finalizar compra'}
              </Button>
            )}

            <Box mt={2}>
              <Button
                className="grey-btn"
                variant="outlined"
                color={isEmpty ? 'primary' : 'inherit'}
                fullWidth
                disableElevation
                onClick={closeDrawer}
              >
                {isEmpty ? 'Retornar às compras' : 'Adicionar mais produtos'}
              </Button>
            </Box>
          </Box>
        </DrawerFooter>
      </DrawerContainer>
    </SwipeableDrawer>
  )
}
