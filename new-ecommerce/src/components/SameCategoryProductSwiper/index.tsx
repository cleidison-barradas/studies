import { Typography } from '@mui/material'
import React, { useEffect, useMemo } from 'react'
import useSWR from 'swr'
import { useEC } from '../../hooks/useEC'
import Category from '../../interfaces/category'
import { getCategoryProducts } from '../../services/category/category.service'
import { ProductSwiper } from '../ProductSwiper'

interface SameCategoryProductSwiperProps {
  categories: Category[]
  ean: string
}

export const SameCategoryProductSwiper: React.FC<SameCategoryProductSwiperProps> = ({ categories = [], ean }) => {
  const { addImpression } = useEC()
  const filtred = categories.filter(_category => _category.name &&
    _category.name.length > 0 &&
    !_category.name.toLowerCase().includes('outros'))
    .map(category => category._id!)

  const { data: categoryResponse } = useSWR(filtred.length > 0 ? `/category/products` : undefined, async () => await getCategoryProducts(filtred))

  const products = useMemo(() =>
    categoryResponse ? categoryResponse.products.filter(product => !product.EAN.includes(ean)).sort((a, b) => b.quantity - a.quantity) : [],
    [categoryResponse, ean])

  useEffect(() => {
    if (products) addImpression(products, 'same category')
  }, [products, addImpression])

  return (
    <React.Fragment>
      {products.length > 0 && (
        <React.Fragment>
          <Typography mt={4} variant="subtitle1" fontSize={{ xs: 18, md: 28 }}>
            Produtos da mesma categoria
          </Typography>
          <ProductSwiper
            buttonColor="primary"
            products={products}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  )
}
