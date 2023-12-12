import { Link, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useTheme } from 'styled-components'
import { DeliveryIcon } from '../../assets/icons'
import { floatToBRL } from '../../helpers/moneyFormat'
import { useCart } from '../../hooks/useCart'
import { CheckoutModal } from '../CheckoutModal'
import DeliveryFreeFromList from '../DeliveryFreeFromList'
import { CaptionCard } from './styles'
import { CartProduct } from '../../interfaces/cart'

export type CardDeliveryFeeCaptionProps = {
  isDocks?: boolean
  virtualProducts: CartProduct[]
  storeProducts: CartProduct[]
}

export const CardDeliveryFeeCaption = ({
  isDocks,
  virtualProducts,
  storeProducts,
}: CardDeliveryFeeCaptionProps) => {
  const { color } = useTheme()
  const { getCartValue } = useCart()
  const [open, setOpen] = useState(false)

  const store = getCartValue(storeProducts)
  const virtual = getCartValue(virtualProducts)

  const openModal = () => setOpen(true)
  const onClose = () => setOpen(false)

  const isValidStore = ({ deliveryFee, subTotal, discount, freeFrom }: Record<string, number>) =>
    deliveryFee <= 0 || Number(subTotal - discount) >= freeFrom

  const isValidVirtual = ({ deliveryFee, subTotal, discount, freeFrom }: Record<string, number>) =>
    isDocks ? deliveryFee <= 0 || Number(subTotal - discount) >= freeFrom : true

  const isValid = isDocks ? isValidStore(store) && isValidVirtual(virtual) : isValidStore(store)

  return isValid ? (
    <></>
  ) : (
    <>
      <CaptionCard>
        {isDocks ? (
          <Typography fontSize="inherit">
            O pedido inclui itens de diferentes estoques que não contabilizam frete grátis. Para
            adicionar ter frete grátis ele precisa adicionar mais{' '}
            {floatToBRL(virtual.freeFrom - (virtual.subTotal - virtual.discount))} de produtos de
            entrega comum. E mais {floatToBRL(store.freeFrom - (store.subTotal - store.discount))}{' '}
            de produtos rápidos.
          </Typography>
        ) : (
          <Typography fontSize="inherit">
            Faltam {floatToBRL(store.freeFrom - (store.subTotal - store.discount))} para obter Frete
            Grátis.
          </Typography>
        )}
        <br />
        Consulte as regras de frete grátis <Link onClick={openModal}>clicando aqui</Link>
      </CaptionCard>
      <CheckoutModal
        icon={<DeliveryIcon color={color.primary.medium} />}
        open={open}
        onClose={onClose}
      >
        <Typography mb={2} fontSize={16}>
          Regras de frete grátis
        </Typography>
        <DeliveryFreeFromList open={open} />
      </CheckoutModal>
    </>
  )
}

export default CardDeliveryFeeCaption
