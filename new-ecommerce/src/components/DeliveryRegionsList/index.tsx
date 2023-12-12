import React, { useContext, useState } from 'react'
import { Input } from '@mypharma/react-components'
import { TreeView, TreeItem } from '@mui/lab'
import { Stack } from '@mui/material'
import useSWR from 'swr'

import { LocationIcon, SearchIcon, DropdownIcon, ClockIcon } from '../../assets/icons'
import { LocationContainer, City, NeighborhoodContainer } from './styles'

import { waypointContext } from '../../contexts/waypoint.context'
import { getDeliveryRegions, getDistanceDeliveryRegions } from '../../services/delivery/delivery.service'
import DeliveryFee from '../../interfaces/deliveryFee'
import { minutesToTime } from '../../helpers/dataConversion'

interface Props {
  open: boolean
  localDeliveryRule: string
}

const DeliveryRegionsList: React.FC<Props> = ({ open = false, localDeliveryRule = 'neighborhood' }) => {
  const [expanded, setExpanded] = useState<string[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [search, setSearch] = useState<string>('')
  const { shouldRenderOptionals } = useContext(waypointContext)

  const { data: neighborhoodDeliveryRegionsData } = useSWR(
    shouldRenderOptionals || open ? 'deliveryRegions' : null,
    getDeliveryRegions
  )
  const { data: distanceDeliveryRegionsData } = useSWR(
    shouldRenderOptionals || open ? 'distanceDeliveryRegions' : null,
    getDistanceDeliveryRegions
  )

  function handleToggle(_: React.SyntheticEvent, nodeIds: string[]) {
    setExpanded(nodeIds)
  }

  function handleSelect(_: React.SyntheticEvent, nodeIds: string[]) {
    setSelected(nodeIds)
  }

  function filter(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined) {
    const value = event?.target.value
    if (value !== undefined) {
      setSearch(value)
    }
  }

  function getDeliveryFeeState(deliveryFees?: DeliveryFee[]) {
    return deliveryFees && deliveryFees[0]?.neighborhood.city.state.code
  }

  return (
    <React.Fragment>
      {localDeliveryRule === 'neighborhood' && (
        <Input
          value={search}
          size="medium"
          onChange={filter}
          placeholder="Busque por bairros"
          StartIcon={() => <SearchIcon />}
        />
      )}
      <LocationContainer>
        <TreeView
          expanded={search ? neighborhoodDeliveryRegionsData?.regions.map(({ _id }) => _id) : expanded}
          selected={selected}
          onNodeToggle={handleToggle}
          onNodeSelect={handleSelect}
        >
          {localDeliveryRule === 'neighborhood' &&
            neighborhoodDeliveryRegionsData?.regions &&
            neighborhoodDeliveryRegionsData.regions
              .filter(({ deliveryFees }) =>
                !!deliveryFees.find(({ neighborhood }) =>
                  neighborhood.name.toLowerCase().includes(search.toLowerCase())
                )
              )
              .map(({ _id, averageTime, deliveryFees }) => (
                <TreeItem
                  className={`container ${search !== '' ? 'selected' : expanded.find((value) => value === _id) ? 'selected' : ''}`}
                  key={_id}
                  label={
                    <City selected={search ? true : !!expanded.find((value) => value === _id)}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <LocationIcon />
                        <span>
                          {_id} - {getDeliveryFeeState(deliveryFees)}
                        </span>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <p>
                          {minutesToTime(Math.round(averageTime)).value}{' '}
                          {minutesToTime(Math.round(averageTime)).suffix}
                        </p>
                        <ClockIcon />
                        <DropdownIcon />
                      </Stack>
                    </City>
                  }
                  nodeId={_id}
                >
                  {deliveryFees
                    .sort((a, b) => a.deliveryTime - b.deliveryTime)
                    .filter(({ neighborhood }) =>
                      neighborhood.name.toLowerCase().includes(search.toLowerCase())
                    )
                    .map(({ neighborhood, deliveryTime }, index) => (
                      <TreeItem
                        nodeId={index.toString()}
                        key={_id}
                        label={
                          <NeighborhoodContainer>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <LocationIcon style={{ minWidth: 24, minHeight: 24 }} />
                              <span> {neighborhood.name} </span>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <p>
                                {minutesToTime(deliveryTime).value} {minutesToTime(deliveryTime).suffix}
                              </p>
                              <ClockIcon />
                            </Stack>
                          </NeighborhoodContainer>
                        }
                      />
                    ))}
                </TreeItem>
              ))}
          {localDeliveryRule === 'distance' &&
            distanceDeliveryRegionsData?.regions &&
            distanceDeliveryRegionsData.regions
              .map(({ _id, distance, deliveryTime }) => (
                <TreeItem
                  nodeId={_id}
                  key={_id}
                  label={
                    <NeighborhoodContainer>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <LocationIcon style={{ minWidth: 24, minHeight: 24 }} />
                        <span>Até {distance/1000} Km</span>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <p>
                          {minutesToTime(deliveryTime).value} {minutesToTime(deliveryTime).suffix}
                        </p>
                        <ClockIcon />
                      </Stack>
                    </NeighborhoodContainer>
                  }
                />
              ))}
        </TreeView>
      </LocationContainer>
    </React.Fragment>
  )
}

export default DeliveryRegionsList
