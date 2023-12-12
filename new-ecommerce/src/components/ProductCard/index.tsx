import React from 'react'
import SVG from 'react-inlinesvg'
import { ProductContainer, ProductImageWrapper, ProductImage, DiscountTag } from './styles'
import ProductImageExample from '../../assets/ilustration/ProductImageExample.svg'
import { AddButton, Button } from '@mypharma/react-components'
import Product from '../../interfaces/product'
import { useTheme } from 'styled-components'
import { Stack, Box, Typography } from '@mui/material'
import { CDN } from '../../config/keys'
import { useCart } from '../../hooks/useCart'
import { Link, useNavigate } from 'react-router-dom'
import { getPercentage } from '../../helpers/getPercentage'
import { useDelivery } from '../../hooks/useDelivery'
import { useEC } from '../../hooks/useEC'
import Capitalize from '../../helpers/Capitalize'
import { useAuth } from '../../hooks/useAuth'
import { floatToBRL } from '../../helpers/moneyFormat'
import CustomTag from '../CustomTag'
import { getBenefitIsValid } from '../../helpers/getBenefitIsValid'
import { lowestProductValue } from '../../helpers/lowestProductValue'
import { trackSearchClick } from '@elastic/behavioral-analytics-javascript-tracker'

import CartFast from '../../assets/icons/CartFast.svg'
import { getProductPrice } from '../../helpers/getProductPrice'
import { getProductActivePromotion } from '../../helpers/getProductActivePromotion'

interface ProductCardProps {
  product: Product
  buttonColor?: 'primary' | 'secondary'
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, buttonColor = 'secondary' }) => {
  const {
    _id,
    name = '',
    image = '',
    presentation = '',
    quantity = 0,
    price = 0,
    manufacturer = null,
    slug = [],
    control = null,
    updateOrigin,
  } = product
  const [firstname, lastname] =
    manufacturer && manufacturer.name ? manufacturer.name.split(' ') : ['', '']
  const productSlug = Array.isArray(slug) && slug.length > 0 ? slug[0] : slug
  const isDocks = updateOrigin === 'Docas'

  const { store } = useAuth()
  const { getExpensiveRegion } = useDelivery()
  const { color } = useTheme()
  const navigate = useNavigate()

  const { addProduct, getProduct, removeProduct, getAuthorizedProduct } = useCart()
  const { addToCart } = useEC()

  const expensiveRegion = getExpensiveRegion()
  const benefitIsValid = getBenefitIsValid({ product })
  const authorizedProduct = getAuthorizedProduct(product.EAN)

  const lowestPrice = lowestProductValue({ product, authorizedProduct })

  const shouldHideStock = store?.settings.config_stock_display === true
  const showProductDetail = control || quantity < 1 || benefitIsValid ? true : false

  const onChangeProductQuantity = (value: number, event: string) => {
    if (value === 0) {
      removeProduct(_id)
    } else {
      if (value <= quantity) {
        addProduct(product, value, event === 'decrease' ? 'Removido da cesta' : undefined)
        if (event !== 'decrease') addToCart(product, 'product card')
      }
    }
  }

  const onClickBuy = () => {
    if (showProductDetail) return navigate(`/produtos/${productSlug}`)
    addProduct(product)
    addToCart(product, 'product card')
  }

  const isDeliveryFree =
    expensiveRegion &&
    expensiveRegion.freeFrom !== 0 &&
    expensiveRegion.freeFrom < getProductPrice(price, getProductActivePromotion(product)?.price)

  return (
    <ProductContainer>
      <Link
        to={`/produtos/${productSlug}${isDocks ? '?v=1' : ''}`}
        onClick={() => {
          window.scrollTo(0, 0)

          trackSearchClick({
            document: {
              id: product.EAN,
              index: product.name
            },
            page: {
              url: `${window.location.href}`
            },
            search: {
              query: '',
              results: {
                items: [
                  {
                    document: {
                      id: product.EAN,
                      index: product.name
                    },
                    page: {
                      url: `${window.location.href}`
                    }
                  }
                ],
                total_results: 1
              },
              search_application: 'ecommerce'
            }
          })
        }}
        style={{ textDecoration: 'none', flex: 1 }}
      >
        <Stack height="100%" justifyContent="space-between" gap={1}>
          <ProductImageWrapper>
            <ProductImage
              alt={name}
              loading="lazy"
              isExample={!!!image}
              src={
                image ? `${CDN.image}${image.thumb ? image.thumb : image.key}` : ProductImageExample
              }
              onError={(e) => {
                e.currentTarget.src = ProductImageExample
                e.currentTarget.style.padding = '0px'
                e.currentTarget.style.objectFit = 'cover'
              }}
            />
            {lowestPrice && <DiscountTag>{getPercentage(price, lowestPrice)}</DiscountTag>}
          </ProductImageWrapper>

          {benefitIsValid && (
            <CustomTag
              label="Desconto Laboratório"
              color={color.suportColor.laboratoryColor}
              background={color.suportColor.laboratoryBackground}
            />
          )}

          <Stack flexDirection="column">
            {isDeliveryFree ? (
              isDocks ? (
                <CustomTag label="Frete grátis" color="#474F57" background="#E0E8F0" />
              ) : (
                <CustomTag
                  icon={<SVG src={CartFast} />}
                  label="Rápido e grátis"
                  color="#006900"
                  background="#B7FFCC"
                />
              )
            ) : (
              !isDocks && (
                <CustomTag
                  label="Rápido"
                  icon={<SVG src={CartFast} />}
                  color={color.primary.medium}
                  background={color.feedback.focus.lightest}
                />
              )
            )}

            {product.buyOneGetTwo && (
              <CustomTag label="Compre 1 leve 2" color="#8A0000" background="#FFA4A4" />
            )}
          </Stack>

          <Stack spacing={1}>
            <Typography
              fontWeight={500}
              mt={1}
              overflow="hidden"
              textOverflow="ellipsis"
              className="name"
            >
              {Capitalize(name)}
            </Typography>
            <Typography color={color.neutral.medium} fontWeight={500}>
              {presentation}
            </Typography>
            {manufacturer && (
              <Typography fontWeight={500}>
                <strong>Fabricante :</strong> {firstname} {lastname}
              </Typography>
            )}
          </Stack>
          <Box mb={1}>
            <Typography
              fontWeight={500}
              color={quantity > 0 ? color.feedback.approve.medium : color.feedback.error.medium}
            >
              {quantity > 0
                ? shouldHideStock
                  ? 'disponível'
                  : `${quantity} disponíveis`
                : 'indisponível'}
            </Typography>
            {lowestPrice ? (
              <Stack direction="row" alignItems="center">
                <Typography fontWeight="bold" fontSize={16}>
                  {floatToBRL(lowestPrice)}
                </Typography>
                <Box ml={1}>
                  <Typography fontSize={12} style={{ textDecoration: 'line-through' }}>
                    {floatToBRL(price)}
                  </Typography>
                </Box>
              </Stack>
            ) : (
              <Typography fontWeight="bold" fontSize={16}>
                {floatToBRL(price)}
              </Typography>
            )}
          </Box>
        </Stack>
      </Link>
      <Box
        height="40px"
        display="flex"
        alignItems="flex-end"
        sx={{
          '@media (min-width: 800px)': {
            height: 56,
          },
        }}
      >
        {getProduct(_id!) ? (
          <AddButton
            maxWidth
            onClick={onChangeProductQuantity}
            value={getProduct(_id!)!.quantity}
            hasValueOne={getProduct(product._id)!.quantity === 1}
            disableIncrease={getProduct(_id!)!.quantity === product.quantity}
          />
        ) : (
          <Button
            textBlack
            fullWidth
            variant="filled"
            color={buttonColor}
            onClick={onClickBuy}
            textColor={color.cta}
            size={window.innerWidth < 800 ? 'small' : 'large'}
          >
            {showProductDetail ? 'Ver detalhes' : 'Comprar'}
          </Button>
        )}
      </Box>
    </ProductContainer>
  )
}
