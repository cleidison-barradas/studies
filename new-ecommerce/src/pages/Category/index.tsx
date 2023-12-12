import React from 'react'
import { CategoryContainer } from '../../components/CategoryContainer'
import { CategoryProducts } from '../../components/CategoryProducts'
import { CategoryProvider } from '../../contexts/category.context'
import { CategoryHelmet } from '../../components/CategoryHelmet'

const CategoryPage: React.FC = () => {
  return (
    <CategoryProvider>
      <CategoryContainer populated={true} />
      <CategoryProducts />
      <CategoryHelmet />
    </CategoryProvider>
  )
}

export default CategoryPage
