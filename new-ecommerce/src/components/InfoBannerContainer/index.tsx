import { Box, Link, Stack, Typography } from '@mui/material'
import React, { useContext, useState } from 'react'
import { SwiperSlide } from 'swiper/react/swiper-react.js'
import useSWR from 'swr'
import {
  DeliveryMotorcicleIcon,
  LockIcon,
  PromotionIcon,
  PixIcon,
  RefundIcon,
  ShippingIcon,
} from '../../assets/icons'
import { InfoBanner } from '../../components/InfoBanner'
import AuthContext from '../../contexts/auth.context'
import { CustomSwiper } from '../../components/Swiper'
import { waypointContext } from '../../contexts/waypoint.context'
import { getSlowerRegion } from '../../helpers/getSlowerRegion'
import { floatToBRL } from '../../helpers/moneyFormat'
import { minutesToTime } from '../../helpers/dataConversion'
import { usePaymentMethod } from '../../hooks/usePaymentMethod'
import { getDeliveryRegions, getDistanceDeliveryRegions } from '../../services/delivery/delivery.service'
import { Subtitle } from './styles'
import { useDelivery } from '../../hooks/useDelivery'
import { CheckoutModal } from '../CheckoutModal'
import DeliveryRegionsList from '../DeliveryRegionsList'

export const InfoBannerContainer: React.FC = () => {
  const { store } = useContext(AuthContext)
  const { shouldRenderOptionals } = useContext(waypointContext)
  const { useFetchDelivery, hasShippingAvailable } = useDelivery()
  const { data } = useSWR(shouldRenderOptionals ? 'deliveryRegions' : null, getDeliveryRegions)
  const { data: deliveries } = useFetchDelivery(shouldRenderOptionals)
  const { data: distanceDeliveryRegions } = useSWR('distanceDeliveryRegions', getDistanceDeliveryRegions)

  const { findOption } = usePaymentMethod()
  const [open, setOpen] = useState(false)

  const localDeliveryRule = store?.settings.config_local_delivery_rule || 'neighborhood'
  let hasFreeFrom = null
  if (localDeliveryRule !== 'distance') {
    hasFreeFrom = deliveries
      .filter((d) => d.freeFrom > 0)
      .sort((a, b) => a.freeFrom - b.freeFrom)
      .shift()
  }
  else if (distanceDeliveryRegions) {
    hasFreeFrom = distanceDeliveryRegions.regions
      .filter((d) => d.freeFrom > 0)
      .sort((a, b) => a.freeFrom - b.freeFrom)
      .shift()
  }

  const regions = data ? data.regions : []

  const time = minutesToTime(Math.round(getSlowerRegion({ regions })?.averageTime || 0)).value
  const suffix = minutesToTime(Math.round(getSlowerRegion({ regions })?.averageTime || 0)).suffix

  const isGenericStore = store?.plan.rule.includes('generic')
  const pickupInStoreActive = store ? store.settings.config_pickup_in_store : false

  return (
    <Stack gap={3}>
      <Subtitle>
        {isGenericStore
          ? 'Os melhores serviços você encontra aqui!'
          : 'O melhor delivery de farmácia da região!'}
      </Subtitle>
      <CustomSwiper
        autoplay={{ delay: 3000 }}
        loop
        slidesPerView={'auto'}
        spaceBetween={24}
        navigation={window.innerWidth > 600}
      >
        <SwiperSlide>
          <InfoBanner
            Icon={LockIcon}
            title="Compra segura"
            description="Seus dados estão protegidos"
          />
        </SwiperSlide>
        <SwiperSlide>
          <InfoBanner
            Icon={RefundIcon}
            title="Trocas e devoluções"
            description="Fique tranquilo em caso de problemas com pedidos"
          />
        </SwiperSlide>
        {findOption('Pix', 'gateway') && (
          <SwiperSlide>
            <InfoBanner
              Icon={PixIcon}
              title="Pague com o pix"
              description="de forma rápida, fácil e segura"
            />
          </SwiperSlide>
        )}
        {regions.length > 0 && (
          <SwiperSlide>
            <InfoBanner
              Icon={DeliveryMotorcicleIcon}
              title={`Entrega ${pickupInStoreActive ? 'ou retirada' : ''}`}
              CustomComponent={
                <Box>
                  <Typography>
                    Enviamos em até {time} {suffix}{' '}
                  </Typography>
                  <Link onClick={() => setOpen(!open)}>(consulte as regiões).</Link>
                </Box>
              }
            />
          </SwiperSlide>
        )}
        {hasFreeFrom && (
          <SwiperSlide>
            <InfoBanner
              Icon={PromotionIcon}
              title="Frete Grátis"
              description={`Para compras acima de ${floatToBRL(
                hasFreeFrom.freeFrom
              )} (consulte condições)`}
            />
          </SwiperSlide>
        )}
        {hasShippingAvailable && (
          <SwiperSlide>
            <InfoBanner
              Icon={ShippingIcon}
              title="Entrega para todo o Brasil"
              description={`com transportadoras seguras e rápidas`}
            />
          </SwiperSlide>
        )}
        <CheckoutModal open={open} onClose={() => setOpen(!open)}>
          <Typography mb={2}>Tempos de entrega</Typography>
          <DeliveryRegionsList open={open} localDeliveryRule={localDeliveryRule} />
        </CheckoutModal>
      </CustomSwiper>
    </Stack>
  )
}

export default InfoBannerContainer
