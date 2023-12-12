import { Typography } from '@mui/material'
import React, { useEffect, useMemo } from 'react'
import useSWR from 'swr'
import { useEC } from '../../hooks/useEC'
import { getRelatedProducts } from '../../services/product/product.service'
import { ProductSwiper } from '../ProductSwiper'

interface WatcherRelatedProductSwiperProps {
  ean: string
}

export const WatcherRelatedProductSwiper: React.FC<WatcherRelatedProductSwiperProps> = ({ ean }) => {
  const { addImpression } = useEC()
  const { data: relatedResponse, isValidating } = useSWR(`/product/related/${ean}`, async () => await getRelatedProducts(ean))

  const related = useMemo(() =>
    relatedResponse ? relatedResponse.products.sort((a, b) => b.quantity - a.quantity) : []
    , [relatedResponse])

  useEffect(() => {
    if (related.length > 0) addImpression(related, 'watcher related')
  }, [related, addImpression])

  return (
    <React.Fragment>
      {!isValidating && related.length === 0 ? (
        <React.Fragment />
      ) : (
        <React.Fragment>
          <Typography mt={4} variant="subtitle1" fontSize={{ xs: 18, md: 28 }}>
            Quem viu este produto também viu:
          </Typography>
          <ProductSwiper buttonColor="primary" products={related} />
        </React.Fragment>
      )}
    </React.Fragment>
  )
}
