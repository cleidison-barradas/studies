import { Button, Stack } from '@mui/material'
import { AddButton } from '@mypharma/react-components'
import React, { useContext } from 'react'
import { useTheme } from 'styled-components'
import { WhatsappIcon } from '../../assets/icons'
import AuthContext from '../../contexts/auth.context'
import { getProductActivePromotion } from '../../helpers/getProductActivePromotion'
import { useCart } from '../../hooks/useCart'
import Product from '../../interfaces/product'
import { Container, WhatsappButton } from './styles'

interface ProductFooterProps {
  product: Product
  onChangeProductQuantity: (value: number) => void
  onClickBuy: () => void
}

export const ProductFooter: React.FC<ProductFooterProps> = ({
  product,
  onClickBuy,
  onChangeProductQuantity,
}) => {
  const { getProduct } = useCart()
  const { store } = useContext(AuthContext)
  const { color } = useTheme()

  return (
    <Container>
      <Stack gap={2} direction="row" justifyContent="space-between">
        {product.control || product.quantity === 0 ? (
          <WhatsappButton
            rel="noopener noreferrer"
            target="_blank"
            href={`https://api.whatsapp.com/send?phone=55${store?.settings.config_whatsapp_phone?.replace(/[^0-9]/g, '')}&text=Olá, estava vendo o *${product.name}*, de valor *${
              getProductActivePromotion(product)
                ? getProductActivePromotion(product)!.price.toFixed(2)
                : product.price.toFixed(2)
            }* no site.`}
          >
            <WhatsappIcon height={26} /> Enviar mensagem no whatsapp
          </WhatsappButton>
        ) : (
          <React.Fragment>
            <AddButton
              onClick={onChangeProductQuantity}
              maxWidth
              disableIncrease={getProduct(product._id)?.quantity === product.quantity}
              value={getProduct(product._id)?.quantity || 0}
            />
            <Button
              onClick={onClickBuy}
              variant="contained"
              style={{ color: color.cta }}
              color="secondary"
              fullWidth
            >
              Comprar
            </Button>
          </React.Fragment>
        )}
      </Stack>
    </Container>
  )
}
