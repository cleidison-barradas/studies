import styled from 'styled-components'
import NextArrowIcon from '../../assets/icons/NextArrow.svg'

interface SwiperWrapperProps {
  paddingTop: string
  paddingBottom: string
}

export const SwiperWrapper = styled.div<SwiperWrapperProps>`
  .swiper-wrapper {
    padding-top: ${({ paddingTop }) => paddingTop};
    padding-bottom: ${({ paddingBottom }) => paddingBottom};
  }

  .swiper-button-next {
    background-image: url(${NextArrowIcon});
    width: 58px;
    height: 58px;
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-position: center;
  }

  .swiper-button-prev {
    background-image: url(${NextArrowIcon});
    width: 58px;
    height: 58px;
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-position: center;
    transform: rotate(180deg);
  }

  .swiper-button-next::after,
  .swiper-button-prev::after {
    content: '';
  }

  .swiper-slide {
    width: auto;
  }
`
