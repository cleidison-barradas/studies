import React from 'react'
import { SwiperSlide } from 'swiper/react/swiper-react.js'
import { ProductCard } from '../../components/ProductCard'
import { CustomSwiper } from '../../components/Swiper'
import Product from '../../interfaces/product'
import { ProductSkeleton } from '@mypharma/react-components'

interface ProductSwiperProps {
  products?: Product[]
  numberOfPlaceholders?: number
  buttonColor?: 'primary' | 'secondary'
}

export const ProductSwiper: React.FC<ProductSwiperProps> = ({
  products,
  numberOfPlaceholders = 10,
  buttonColor,
}) => {
  return (
    <React.Fragment>
      <CustomSwiper
        paddingTop="16px"
        paddingBottom="16px"
        slidesPerView={'auto'}
        spaceBetween={24}
        navigation={true}
      >
        {products
          ? products.map((product) => (
            <SwiperSlide key={product._id}>
              <ProductCard buttonColor={buttonColor} product={product} />
            </SwiperSlide>
          ))
          : [...Array(numberOfPlaceholders)].map((x, i) => (
            <SwiperSlide key={i}>
              <ProductSkeleton key={i} />
            </SwiperSlide>
          ))}
      </CustomSwiper>
    </React.Fragment>
  )
}
