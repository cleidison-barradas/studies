import { useContext } from 'react'
import { useLocation } from 'react-router'
import SVG from 'react-inlinesvg'
import { useTheme } from 'styled-components'
import { AddButton } from '@mypharma/react-components'
import { Footer, Header, ProductCard, ProductImage, ProductName } from './styles'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import CustomTag from '../CustomTag'

import ProductImageExample from '../../assets/ilustration/ProductImageExample.svg'
import { TrashIcon } from '../../assets/icons'

import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'

import CartContext from '../../contexts/cart.context'

import Product from '../../interfaces/product'

import { getProductSlowerSpecial } from '../../helpers/getProductSlowerSpecial'
import { getProductPrice } from '../../helpers/getProductPrice'
import { floatToBRL } from '../../helpers/moneyFormat'

import { CDN } from '../../config/keys'
import { useDelivery } from '../../hooks/useDelivery'

import CartFast from '../../assets/icons/CartFast.svg'
import { IShipping } from '../../interfaces/shipping'
import { SelectedAddressCard } from '../SelectedAddressCard'
import Address from '../../interfaces/address'
import Region from '../../interfaces/regions'
import { DeliveryMode } from '../../interfaces/deliveryMode'
import { DeliverySchedule } from '../../interfaces/deliverySchedule'

interface CartProductProps {
  product: Product
  address?: Address | null
  contrast?: boolean
  removeDecreaseButton?: boolean
  deliveryFee?: number
  removeIncreaseButton?: boolean
  removeQuantityButtons?: boolean
  shipping?: IShipping | null
  removeDiscount?: boolean
  region?: Region
  deliveryMode?: DeliveryMode
  schedules?: DeliverySchedule[] | null
  hasVirtualProducts?: boolean
}

export const CartProduct = ({
  product,
  contrast = false,
  address,
  removeDecreaseButton,
  removeIncreaseButton,
  deliveryMode,
  deliveryFee,
  schedules,
  region,
  removeQuantityButtons,
  shipping,
  removeDiscount,
}: CartProductProps) => {
  const {
    removeProduct,
    getDeliveryRegion,
    getProduct,
    addProduct,
    getCupomDiscount,
    getAuthorizedProduct,
  } = useCart()
  const { cart, fromPaymentLink } = useContext(CartContext)
  const { pathname } = useLocation()
  const { store } = useAuth()
  const { color } = useTheme()
  const { getExpensiveRegion } = useDelivery()

  const authorizedProduct = getAuthorizedProduct(product.EAN)
  const expensiveRegion = getExpensiveRegion()
  const deliveryRegion = getDeliveryRegion()

  const cupomDiscount = getCupomDiscount(product, authorizedProduct)

  const promotional = getProductSlowerSpecial(product, authorizedProduct)

  const shouldHideStock = store?.settings.config_stock_display === true

  const isDocks = product.updateOrigin === 'Docas'

  const deliveryTime = `${(shipping?.custom_delivery_range.min || 0) + (isDocks ? 3 : 0)} a ${(shipping?.custom_delivery_range.max || 0) + (isDocks ? 6 : 0)
    } dias`

  const isCheckout = pathname === '/checkout'

  const tag = (
    <>
      {deliveryFee === 0 && expensiveRegion && !isDocks ? (
        <CustomTag
          block={false}
          icon={<SVG src={CartFast} />}
          label="Rápido e grátis"
          color="#006900"
          background="#B7FFCC"
        />
      ) : !isDocks ? (
        <CustomTag
          block={false}
          label="Rápido"
          icon={<SVG src={CartFast} />}
          color={color.primary.medium}
          background={color.feedback.focus.lightest}
        />
      ) : (
        <CustomTag
          block={false}
          label={'Chega em ' + deliveryTime}
          color="#7A828A"
          border="#7A828A"
          background="#FFFFFF"
        />
      )}
    </>
  )

  return (
    <ProductCard color={contrast ? 'secondary' : 'neutral'} key={product._id}>
      <Header>
        <ProductImage
          color={contrast ? 'secondary' : 'neutral'}
          src={product.image ? `${CDN.image}${product.image.key}` : ProductImageExample}
          onError={(e) => {
            e.currentTarget.src = ProductImageExample
            e.currentTarget.style.padding = '0px'
          }}
        />

        <div className="content">
          <ProductName>{product.name}</ProductName>

          <div className="info">
            {(promotional || cupomDiscount) && !removeDiscount ? (
              <p className="price">{floatToBRL(product.price)}</p>
            ) : (
              <p className="price">
                {promotional || cupomDiscount
                  ? floatToBRL(
                    getProductPrice(product.price, promotional, cupomDiscount, fromPaymentLink)
                  )
                  : floatToBRL(product.price)}
              </p>
            )}

            {!isCheckout && tag}

            <div>
              <Typography
                fontWeight={500}
                color={
                  product.quantity > 0 ? color.feedback.approve.medium : color.feedback.error.medium
                }
              >
                {shouldHideStock
                  ? product.quantity > 0
                    ? 'disponível'
                    : 'indisponível'
                  : ` ${product.quantity} disponíveis`}
              </Typography>
            </div>

            {product.manufacturer && (
              <p className="manufacturer">
                <strong>Fabricante:</strong> {product.manufacturer?.name}
              </p>
            )}
          </div>
        </div>
      </Header>

      {isCheckout && !!(deliveryMode === 'own_delivery' ? deliveryRegion : shipping) && (
        <SelectedAddressCard
          address={address}
          shipping={shipping}
          hasVirtualProducts={isDocks}
          region={region}
          schedules={schedules}
          price={
            deliveryFee !== 0 && isCheckout
              ? floatToBRL(deliveryFee || 0)
              : deliveryFee !== 0 && isDocks
                ? floatToBRL(deliveryFee || 0)
                : undefined
          }
          deliveryMode={deliveryMode}
        >
          {tag}
        </SelectedAddressCard>
      )}

      <Footer>
        <AddButton
          onClick={(value, event) => {
            if (value === 0) {
              removeProduct(product._id)
            } else {
              if (value <= product.quantity) {
                addProduct(product, value, event === 'decrease' ? 'Removido da cesta' : undefined)
              }
            }
          }}
          hasValueOne={getProduct(product._id)!.quantity === 1}
          disableIncrease={
            removeIncreaseButton || getProduct(product._id)!.quantity === product.quantity
          }
          value={getProduct(product._id)!.quantity}
        />

        <Box mb={removeQuantityButtons ? 0 : 1}>
          {cart.products?.length > 0 && (
            <Tooltip title="Remover produto da cesta">
              <IconButton onClick={() => removeProduct(product._id)}>
                <TrashIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Footer>
    </ProductCard>
  )
}
