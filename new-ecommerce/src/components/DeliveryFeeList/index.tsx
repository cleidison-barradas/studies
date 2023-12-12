import { Typography } from '@mui/material'
import React, { useContext } from 'react'
import useSWR from 'swr'
import { waypointContext } from '../../contexts/waypoint.context'
import { floatToBRL } from '../../helpers/moneyFormat'
import { getDeliveryRegions } from '../../services/delivery/delivery.service'

export const DeliveryFeeList = () => {
  const { shouldRenderOptionals } = useContext(waypointContext)
  const { data } = useSWR(shouldRenderOptionals ? 'deliveryRegions' : null, getDeliveryRegions)

  return (
    <React.Fragment>
      {data?.regions?.map(region => {
        const city = region._id
        const stateCode = region.deliveryFees[0].neighborhood.city.state.code || ''
        const freeFrom = region.deliveryFees.length > 0 ? region.deliveryFees.sort((a, b) => a.freeFrom - b.freeFrom)[0].freeFrom : 0
        return (
          <Typography mb={1} fontSize={14} key={region._id}>
            {`${city} - ${stateCode}:`} A partir de
            {floatToBRL(freeFrom)} em compras pelo site.
          </Typography>
        )
      })}
    </React.Fragment>
  )
}
