import { Stack } from '@mui/material'
import React, { useContext, lazy, Suspense, useEffect } from 'react'
import { BannerContainer } from '../../components/BannerContainer'
import { useSearchParams } from 'react-router-dom'
import { CategorySkeleton } from '@mypharma/react-components'
import useSWR from 'swr'
import { getBanner } from '../../services/banner/banner.service'
import { RedirectModal } from '../../components/RedirectModal'
import { waypointContext } from '../../contexts/waypoint.context'
import { useSearch } from '../../hooks/useSearch'

const CategoryContainer = lazy(() => import('../../components/CategoryContainer'))
const ProductSearchContainer = lazy(() => import('../../components/ProductSearchContainer'))
const ShowcaseContainer = lazy(() => import('../../components/ShowcaseContainer'))
const InfoBannerContainer = lazy(() => import('../../components/InfoBannerContainer'))
const Faq = lazy(() => import('../../components/Faq'))

export const Home: React.FC = () => {
  const { shouldRenderOptionals } = useContext(waypointContext)
  const [searchParams] = useSearchParams()
  const { search } = useSearch()

  const { data: bannerRequest, error: bannerRequestError } = useSWR('banners', getBanner)

  useEffect(() => {
    if (searchParams.has('q')) search(searchParams.get('q'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <React.Fragment>
      <Stack spacing={3}>
        <Suspense fallback={CategorySkeleton}>
          <CategoryContainer />
        </Suspense>
        {searchParams.get('q') ? (
          <Suspense fallback={<React.Fragment />}>
            <ProductSearchContainer />
          </Suspense>
        ) : (
          <React.Fragment>
            {bannerRequest && !bannerRequestError && bannerRequest.banners.length > 0 ? (
              <BannerContainer />
            ) : (
              <InfoBannerContainer />
            )}
            <Suspense fallback={<React.Fragment />}>
              <ShowcaseContainer />
            </Suspense>
            <Suspense fallback={<React.Fragment />}>
              {bannerRequest && !bannerRequestError && bannerRequest.banners.length > 0 && (
                <InfoBannerContainer />
              )}
            </Suspense>
            {shouldRenderOptionals && (
              <Suspense fallback={<React.Fragment />}>
                <Faq />
              </Suspense>
            )}
          </React.Fragment>
        )}
      </Stack>
      <RedirectModal />
    </React.Fragment>
  )
}
