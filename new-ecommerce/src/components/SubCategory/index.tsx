import React, { useState } from 'react'

import { CategoryContainer, CategoryText, Container, ReturnButton } from './styles'
import { CategoryFilterDialog } from '../CategoryFilterDialog'
import { CustomSwiper } from '../Swiper'
import { SwiperSlide } from 'swiper/react/swiper-react.js'

export interface CategoryFilter {
  name: string
  title: string
  Icon: React.ReactNode
  onClick: () => void
  isForm?: boolean
}

export interface SubCategoryProps {
  title: string
  initialFilter?: string
  filters?: CategoryFilter[]
  onReturn?: () => any
  ReturnIcon?: React.ReactNode
}

export const SubCategory: React.FC<SubCategoryProps> = ({
  title,
  children,
  filters = [],
  onReturn,
  ReturnIcon,
}) => {
  const [open, setOpen] = useState(false)

  return (
    <React.Fragment>
      <Container>
        <CategoryContainer>
          <ReturnButton onClick={onReturn}>{ReturnIcon}</ReturnButton>
          <CategoryText>{title}</CategoryText>
        </CategoryContainer>
        <CustomSwiper
          paddingBottom="16px"
          paddingTop="16px"
          slidesPerView={'auto'}
          spaceBetween={24}
          navigation={true}
        >
          {React.Children.map(children, (child, index) => (
            <SwiperSlide key={index}>{child}</SwiperSlide>
          ))}
        </CustomSwiper>
      </Container>
      {open && (
        <CategoryFilterDialog filters={filters} onClickAway={() => setOpen(false)} open={open} />
      )}
    </React.Fragment>
  )
}

export { SubCategoryButton } from './styles'
