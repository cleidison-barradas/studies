import { Grid, Hidden, Typography } from '@mui/material'
import { Box } from '@mui/material'
import React, { useEffect } from 'react'
import { SwiperSlide } from 'swiper/react/swiper-react.js'
import useSWR from 'swr'
import { useEC } from '../../hooks/useEC'
import { GetMostPurchased } from '../../services/product/product.service'
import { ProductCard } from '../ProductCard'
import { CustomSwiper } from '../Swiper'

export const MostPurchasedProducts: React.FC = () => {
  const { data } = useSWR('products/mostpurchased', GetMostPurchased)
  const { addImpression } = useEC()

  useEffect(() => {
    if (data?.products) addImpression(data.products, 'customer most purchaser')
  }, [data, addImpression])

  return (
    <Box mt={5}>
      {data?.products && data.products.length > 0 && (
        <Typography fontSize={24}>Produtos mais pedidos !</Typography>
      )}
      <Box mt={2}>
        <Hidden smUp>
          <Grid wrap="nowrap" overflow="auto" container spacing={2}>
            {data?.products.map((product) => (
              <Grid item key={product._id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Hidden>

        <Hidden smDown>
          <CustomSwiper slidesPerView={'auto'} spaceBetween={24} navigation={true}>
            {data?.products.map((product) => (
              <SwiperSlide key={product._id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </CustomSwiper>
        </Hidden>
      </Box>
    </Box>
  )
}
