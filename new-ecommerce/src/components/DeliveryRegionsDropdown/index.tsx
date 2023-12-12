import { ClickAwayListener, Grow, Popper, Stack } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { DeliveryIcon, DropdownIcon } from '../../assets/icons'
import { Container, PopperContainer } from './styles'
import { useLocation } from 'react-router'
import AuthContext from '../../contexts/auth.context'
import { DeliveryRegions } from '../../services/delivery/response.interface'
import useSWR from 'swr'
import {
  getDeliveryRegions,
  getDistanceDeliveryRegions,
} from '../../services/delivery/delivery.service'
import { waypointContext } from '../../contexts/waypoint.context'
import { DeliveryRegionsDropdownContent } from '../DeliveryRegionsDropdownContent'
import { minutesToTime } from '../../helpers/dataConversion'
import { useTheme } from 'styled-components'
import { calculateAverageDeliveryTime } from '../../helpers/getAverageDeliveryTime'

export const DeliveryRegionsDropdown: React.FC = () => {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [storeRegion, setStoreRegion] = useState<DeliveryRegions | undefined>()
  const { shouldRenderOptionals } = useContext(waypointContext)
  const { store } = useContext(AuthContext)
  const [averageDeliveryTimeText, setAverageDeliveryTimeText] = useState('Tempos de entrega')
  const { color } = useTheme()
  const localDeliveryRule = store?.settings.config_local_delivery_rule || 'neighborhood'

  const { data: neighborhoodDeliveryRegionsData } = useSWR('deliveryRegions', getDeliveryRegions)
  const { data: distanceDeliveryRegionsData } = useSWR(
    shouldRenderOptionals || open ? 'distanceDeliveryRegions' : null,
    getDistanceDeliveryRegions
  )

  const handleClick = (event: any) => {
    setOpen((isOpen) => !isOpen)
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const handleClickAway = () => {
    setOpen(false)
    setAnchorEl(null)
  }

  useEffect(() => {
    const city = neighborhoodDeliveryRegionsData?.regions.find(
      ({ _id }) => _id.toLowerCase() === store?.settings.config_store_city?.toLowerCase()
    )
    if (city) setStoreRegion(city)
  }, [neighborhoodDeliveryRegionsData?.regions, store])

  useEffect(() => {
    if (localDeliveryRule === 'distance' && distanceDeliveryRegionsData) {
      const averageTime = Math.round(calculateAverageDeliveryTime(distanceDeliveryRegionsData))
      const formattedTime = minutesToTime(averageTime)

      setAverageDeliveryTimeText(
        `Entrega ${formattedTime.value} ${formattedTime.suffix} em ${store?.settings.config_store_city}`
      )
    } else if (storeRegion) {
      const averageTime = Math.round(storeRegion.averageTime)
      if (averageTime > 0) {
        const formattedTime = minutesToTime(averageTime)
        setAverageDeliveryTimeText(
          `Entrega ${formattedTime.value} ${formattedTime.suffix} em ${storeRegion._id} - ${storeRegion?.deliveryFees[0]?.neighborhood.city.state.code}`
        )
      }
    }
  }, [
    localDeliveryRule,
    storeRegion,
    neighborhoodDeliveryRegionsData,
    distanceDeliveryRegionsData,
    store,
  ])

  return (
    <React.Fragment>
      <Container
        mainPage={pathname === '/produtos' || (window.innerWidth < 1200 && window.innerWidth > 600)}
        open={open}
        onClick={handleClick}
      >
        <Stack
          fontSize="inherit"
          letterSpacing="inherit"
          direction="row"
          gap={2}
          alignItems="center"
          style={{ color: color.headerTextColor }}
        >
          <DeliveryIcon />
          {averageDeliveryTimeText}
        </Stack>
        <DropdownIcon className="arrowIcon" color={color.headerTextColor} />
      </Container>
      <Popper transition open={open} style={{ zIndex: 2 }} anchorEl={anchorEl}>
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClickAway}>
            <Grow {...TransitionProps}>
              <PopperContainer>
                <DeliveryRegionsDropdownContent open={open} localDeliveryRule={localDeliveryRule} />
              </PopperContainer>
            </Grow>
          </ClickAwayListener>
        )}
      </Popper>
    </React.Fragment>
  )
}
