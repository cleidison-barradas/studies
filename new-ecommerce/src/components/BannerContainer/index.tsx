import { Grid, Hidden } from '@mui/material'
import { Banner } from '@mypharma/react-components'
import React from 'react'
import useSWR from 'swr'
import { CustomSwiper } from '../Swiper'
import { getBanner } from '../../services/banner/banner.service'
import { SwiperSlide } from 'swiper/react/swiper-react.js'

export const BannerContainer: React.FC = () => {
  const { data, error } = useSWR('banners', getBanner)

  if (error) return <React.Fragment />

  return (
    <React.Fragment>
      <Hidden mdUp>
        <Grid container overflow="auto" wrap="nowrap" spacing={2}>
          {data &&
            data.banners.map(({ image, _id, url }) => (
              <Grid key={_id} item>
                <Banner
                  onClick={() => {
                    if (url) {
                      window.open(url, '_blank')
                    }
                  }}
                  text={''}
                  image={image.url}
                />
              </Grid>
            ))}
        </Grid>
      </Hidden>
      <Hidden mdDown>
        <div>
          <CustomSwiper slidesPerView={'auto'} spaceBetween={24} navigation={true}>
            {data &&
              data.banners.map(({ image, _id, url }) => (
                <SwiperSlide key={_id}>
                  <Banner
                    onClick={() => {
                      if (url) {
                        window.open(url, '_blank')
                      }
                    }}
                    text={''}
                    image={image.url}
                  />
                </SwiperSlide>
              ))}
          </CustomSwiper>
        </div>
      </Hidden>
    </React.Fragment>
  )
}
