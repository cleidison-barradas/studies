import React from 'react'
import { Hidden, Box, Grid } from '@mui/material'
import { Container, InnerContainer } from '../../containers/Layout/styles'
import { CustomSwiper } from '../../components/Swiper'
import { SwiperSlide } from 'swiper/react/swiper-react.js'
import { ThemeProvider as LocalThemeProvider } from '../../components/ThemeProvider'
import {
  ThemeProvider,
  HeaderSkeleton,
  CategorySkeleton,
  BannerSkeleton,
  ProductSkeleton,
  TitleSkeleton,
} from '@mypharma/react-components'

const categoryRender = [1, 2, 3, 4, 5, 6, 7]
const bannerRender = [1, 2, 3]
const showcaseRender = [1, 2, 3, 4, 5, 6]

export const StartupSkeleton: React.FC = () => {
  return (
    <ThemeProvider>
      <LocalThemeProvider>
        <div>
          <HeaderSkeleton />
          <Container isHeaderHidden={false} isFooterHidden={false}>
            <InnerContainer>
              <Category />
              <Box mt={4}>
                <Banner />
              </Box>
              <Box mt={4}>
                <Showcase />
              </Box>
            </InnerContainer>
          </Container>
        </div>
      </LocalThemeProvider>
    </ThemeProvider>
  )
}

const Category: React.FC = () => {
  return (
    <React.Fragment>
      <Box overflow="auto">
        <Grid spacing={{ sm: 2, md: 4 }} wrap="nowrap" container>
          {categoryRender.map((item) => (
            <Grid item key={item}>
              <CategorySkeleton />
            </Grid>
          ))}
        </Grid>
      </Box>
    </React.Fragment>
  )
}

const Banner: React.FC = () => {
  return (
    <React.Fragment>
      <Hidden mdUp>
        <Grid container overflow="auto" wrap="nowrap" spacing={2}>
          {bannerRender.map((item) => (
            <Grid key={item} item>
              <BannerSkeleton />
            </Grid>
          ))}
        </Grid>
      </Hidden>
      <Hidden mdDown>
        <CustomSwiper slidesPerView={'auto'} spaceBetween={24} navigation={true}>
          {bannerRender.map((item) => (
            <SwiperSlide key={item}>
              <BannerSkeleton />
            </SwiperSlide>
          ))}
        </CustomSwiper>
      </Hidden>
    </React.Fragment>
  )
}

const Showcase: React.FC = () => {
  return (
    <React.Fragment>
      <TitleSkeleton />
      <Box mt={2}>
        <Hidden smUp>
          <Grid wrap="nowrap" overflow="auto" container spacing={2}>
            {showcaseRender.map((item) => (
              <Grid item key={item}>
                <ProductSkeleton />
              </Grid>
            ))}
          </Grid>
        </Hidden>
        <Hidden smDown>
          <CustomSwiper slidesPerView={'auto'} spaceBetween={24} navigation={true}>
            {showcaseRender.map((item) => (
              <SwiperSlide key={item}>
                <ProductSkeleton />
              </SwiperSlide>
            ))}
          </CustomSwiper>
        </Hidden>
      </Box>
    </React.Fragment>
  )
}
