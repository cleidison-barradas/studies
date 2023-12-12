import { Box, Stack } from '@mui/material'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Waypoint } from 'react-waypoint'
import { SwiperSlide } from 'swiper/react/swiper-react.js'
import useSWR from 'swr'
import { ProductCard } from '../../components/ProductCard'
import { CustomSwiper } from '../../components/Swiper'
import AuthContext from '../../contexts/auth.context'
import { getShowcase } from '../../services/showcase/showcase.service'
import { Subtitle, Title } from './styles'
import { waypointContext } from '../../contexts/waypoint.context'
import { ProductSkeleton } from '@mypharma/react-components'
import { useEC } from '../../hooks/useEC'
import Product from '../../interfaces/product'

export const ShowcaseContainer: React.FC = () => {
  const { store } = useContext(AuthContext)
  const { setShouldRenderOptionals } = useContext(waypointContext)
  const { data } = useSWR('showcase', getShowcase, { errorRetryCount: 2 })
  const { addImpression } = useEC()

  const [allowedIndex, setAllowedIndex] = useState(1)

  useEffect(() => {
    if (data?.showcases) {
      data.showcases.forEach((value) => {
        addImpression(
          value.products.map((product) => product.product),
          'showcase'
        )
      })
    }
  }, [data?.showcases, addImpression])

  const sorted = useMemo(
    () =>
      data?.showcases.sort((first, second) => {
        if (!first.position) return -1
        if (!second.position) return 1

        if (first.position > second.position) return 1
        else return -1
      }),
    [data]
  )

  if (!data?.showcases)
    return (
      <Stack overflow="auto" direction="row" spacing={2}>
        {new Array(...new Array(5)).map((value, index) => (
          <ProductSkeleton key={index} />
        ))}
      </Stack>
    )

    const filter = (product: Product) => (product.EAN && product.EAN.length > 0 && product.name && product.name.length > 0)

  return (
    <div>
      <Title> {store?.name} </Title>
      <Box>
        <Stack spacing={5}>
          {sorted?.slice(0, allowedIndex)
            .map(({ products, name, _id }) => (
              <Box key={_id}>
                <Waypoint onEnter={() => setAllowedIndex((value) => value + 1)} />
                <Subtitle> {name} </Subtitle>
                <CustomSwiper
                  paddingTop="12px"
                  paddingBottom="12px"
                  slidesPerView={'auto'}
                  spaceBetween={24}
                  navigation={true}
                >
                  {products.filter(_product => filter(_product.product)).map(({ product }) => (
                    <SwiperSlide key={product._id}>
                      <ProductCard product={product} />
                    </SwiperSlide>
                  ))}
                </CustomSwiper>
              </Box>
            ))}
        </Stack>
      </Box>
      <Waypoint onEnter={() => setShouldRenderOptionals(true)} />
    </div>
  )
}

export default ShowcaseContainer
