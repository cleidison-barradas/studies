import React from 'react'
import {
  CategoryContainer,
  CategoryImageContainer,
  CategoryText,
} from './styles'

import Placeholder from '../../assets/ExampleCategory.svg'

export interface CategoryProps {
  image?: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export const CategoryCard: React.FC<CategoryProps> = ({
  children,
  image = Placeholder,
  onClick,
}) => {
  return (
    <CategoryContainer onClick={onClick}>
      <CategoryImageContainer  >{image}</CategoryImageContainer>
      <CategoryText>{children}</CategoryText>
    </CategoryContainer>
  )
}
