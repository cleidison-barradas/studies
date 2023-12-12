import { Box, IconButton } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router'
import { useTheme } from 'styled-components'
import { CloseIcon } from '../../assets/icons'
import { CDN } from '../../config/keys'
import Product from '../../interfaces/product'
import { removeProductHistory } from '../../services/searchHistory/searchHistory.service'
import { ProductSuggestionLink } from './styles'
import ProductImageExample from '../../assets/ilustration/ProductImageExample.svg'

interface ProductHistorySearchLinkProps {
  slug: string
  name: string
  image: Product['image']
  updateOrigin: string
  _id: string
  onClick: () => void
}

export const ProductHistorySearchLink: React.FC<ProductHistorySearchLinkProps> = ({
  slug,
  name,
  image,
  onClick,
  updateOrigin,
  _id,
}) => {
  const navigate = useNavigate()
  const { color } = useTheme()

  return (
    <Box position="relative">
      <ProductSuggestionLink
        onClick={() => {
          onClick()
          navigate(`/produtos/${slug}${updateOrigin === 'Docas' ? '?v=1' : ''}`)
        }}
      >
        <img
          alt={name}
          loading="lazy"
          src={
            image
              ? new URL(image.thumb ? image.thumb : image.key, CDN.image).href
              : ProductImageExample
          }
          onError={(e) => {
            e.currentTarget.src = ProductImageExample
            e.currentTarget.style.padding = '0px'
            e.currentTarget.style.objectFit = 'cover'
          }}
        />

        {name.split(' ').shift()}
      </ProductSuggestionLink>
      <IconButton
        style={{ position: 'absolute', right: 2, top: 2, zIndex: 9999 }}
        onMouseDown={() => removeProductHistory(_id)}
      >
        <CloseIcon height={18} color={color.neutral.dark} />
      </IconButton>
    </Box>
  )
}
