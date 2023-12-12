import { TreeView, TreeItem } from '@mui/lab'
import { Stack, Typography } from '@mui/material'
import { Input } from '@mypharma/react-components'
import React, { useContext, useState } from 'react'
import useSWR from 'swr'
import { LocationIcon, ClockIcon, SearchIcon, DropdownIcon } from '../../assets/icons'
import { waypointContext } from '../../contexts/waypoint.context'
import { minutesToTime } from '../../helpers/dataConversion'
import { useDelivery } from '../../hooks/useDelivery'
import DeliveryFee from '../../interfaces/deliveryFee'
import { getDeliveryRegions, getDistanceDeliveryRegions } from '../../services/delivery/delivery.service'
import { LocationContainer, City, NeighborhoodContainer } from '../DeliveryRegionsDropdown/styles'

interface DeliveryRegionsDropdownContentProps {
  open: boolean
  localDeliveryRule: string
}

export const DeliveryRegionsDropdownContent: React.FC<DeliveryRegionsDropdownContentProps> = ({
  open,
  localDeliveryRule,
}) => {
  const { hasShippingAvailable } = useDelivery()

  const [expanded, setExpanded] = useState<string[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [search, setSearch] = useState<string>('')

  const { shouldRenderOptionals } = useContext(waypointContext)

  const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setExpanded(nodeIds)
  }

  const handleSelect = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setSelected(nodeIds)
  }

  const { data: neighborhoodDeliveryRegionsData } = useSWR(
    shouldRenderOptionals || open ? 'deliveryRegions' : null,
    getDeliveryRegions
  )

  const { data: distanceDeliveryRegionsData } = useSWR(
    shouldRenderOptionals || open ? 'distanceDeliveryRegions' : null,
    getDistanceDeliveryRegions
  )

  const filter = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined
  ) => {
    const value = event?.target.value
    if (value !== undefined) {
      setSearch(value)
    }
  }

  const getDeliveryFeeState = (deliveryFees?: DeliveryFee[]) => {
    return deliveryFees && deliveryFees[0]?.neighborhood.city.state.code
  }

  if (localDeliveryRule === 'distance') {
    return (
      <React.Fragment>
        <Typography>
          Tempos de entrega para distâncias em relação à loja.
        </Typography>
        <LocationContainer>
          <TreeView
            expanded={search ? distanceDeliveryRegionsData?.regions.map(({ _id }) => _id) : expanded}
            selected={selected}
            onNodeToggle={handleToggle}
            onNodeSelect={handleSelect}
          >
            {distanceDeliveryRegionsData?.regions
              ? distanceDeliveryRegionsData?.regions
                  .map(({ _id, distance, deliveryTime }) => (
                    <TreeItem
                      nodeId={_id}
                      key={_id}
                      label={
                        <NeighborhoodContainer>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <LocationIcon style={{ minWidth: 24, minHeight: 24 }} />
                            <span>Até {distance/1000}Km</span>
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
                  ))
              : null}
          </TreeView>
          {hasShippingAvailable && (
            <Typography>
              Para demais regiões do Brasil, siga no fluxo de pedido para saber qual o tempo de entrega para sua região.
            </Typography>
          )}
        </LocationContainer>
      </React.Fragment>
    )
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
          {neighborhoodDeliveryRegionsData?.regions
            ? neighborhoodDeliveryRegionsData?.regions
                .filter(
                  ({ deliveryFees }) =>
                    !!deliveryFees.find(({ neighborhood }) =>
                      neighborhood.name.toLowerCase().includes(search.toLowerCase())
                    )
                )
                .map(({ _id, averageTime, deliveryFees }) => (
                  <TreeItem
                    className={`container ${search !== ''
                      ? 'selected'
                      : expanded.find((value) => value === _id)
                      ? 'selected'
                      : ''
                    } `}
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
                                  {minutesToTime(deliveryTime).value}{' '}
                                  {minutesToTime(deliveryTime).suffix}
                                </p>
                                <ClockIcon />
                              </Stack>
                            </NeighborhoodContainer>
                          }
                        />
                      ))}
                  </TreeItem>
                ))
            : null}
        </TreeView>
        {hasShippingAvailable && (
          <Typography>
            Para demais regiões do Brasil, siga no fluxo de pedido para saber qual o tempo de entrega para sua região.
          </Typography>
        )}
      </LocationContainer>
    </React.Fragment>
  )
}