import React from 'react'
import { SwiperWrapper } from './styles'
import SwiperCore, { Navigation, Autoplay } from 'swiper'

// Direct React component imports
import { SwiperProps, Swiper } from 'swiper/react/swiper-react.js'

// Styles must use direct files imports
import 'swiper/swiper-bundle.css' // core Swiper

SwiperCore.use([Navigation, Autoplay])

interface CustomSwiperProps extends SwiperProps {
  paddingTop?: string
  paddingBottom?: string
}

export const CustomSwiper: React.FC<CustomSwiperProps> = ({
  children,
  paddingTop = '0px',
  paddingBottom = '0px',
  ...props
}) => {
  return (
    <SwiperWrapper paddingTop={paddingTop} paddingBottom={paddingBottom}>
      <Swiper {...props}>{children}</Swiper>
    </SwiperWrapper>
  )
}
