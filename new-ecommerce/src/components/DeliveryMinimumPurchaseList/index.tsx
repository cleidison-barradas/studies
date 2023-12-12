import React, { useContext, useState } from 'react'
import { Stack } from '@mui/material'
import { TreeItem, TreeView } from '@mui/lab'
import { Input } from '@mypharma/react-components'
import useSWR from 'swr'

import { waypointContext } from '../../contexts/waypoint.context'
import DeliveryFee from '../../interfaces/deliveryFee'
import { getDeliveryRegions } from '../../services/delivery/delivery.service'
import { floatToBRL } from '../../helpers/moneyFormat'
import { LocationIcon, SearchIcon, DropdownIcon } from '../../assets/icons'
import { LocationContainer, City, NeighborhoodContainer } from './styles'

interface Props {
  open: boolean
}

const DeliveryMinimumPurchaseList: React.FC<Props> = ({ open }) => {
  const [expanded, setExpanded] = useState<string[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [search, setSearch] = useState<string>('')
  const { shouldRenderOptionals } = useContext(waypointContext)
  const { data } = useSWR(shouldRenderOptionals || open ? 'deliveryRegions' : null, getDeliveryRegions)

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

  return <React.Fragment>
    <Input
      value={search}
      size="medium"
      onChange={filter}
      placeholder="Busque por bairros"
      StartIcon={() => <SearchIcon />}
    />
    <LocationContainer>
      <TreeView
        expanded={search ? data?.regions.map(({ _id }) => _id) : expanded}
        selected={selected}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
      >
        {data?.regions
          ? data?.regions
            .filter(
              ({ deliveryFees }) =>
                !!deliveryFees.find(({ neighborhood }) =>
                  neighborhood.name.toLowerCase().includes(search.toLowerCase())
                )
            )
            .map(({ _id, deliveryFees }) => (
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
                      <DropdownIcon />
                    </Stack>
                  </City>
                }
                nodeId={_id}
              >
                {deliveryFees
                  .sort((a, b) => a.minimumPurchase - b.minimumPurchase)
                  .filter(({ neighborhood }) =>
                    neighborhood.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .map(({ neighborhood, minimumPurchase }, index) => (
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
                            <p>valor mínimo {floatToBRL(minimumPurchase)}</p>

                          </Stack>
                        </NeighborhoodContainer>
                      }
                    />
                  ))}
              </TreeItem>
            ))
          : null}
      </TreeView>
    </LocationContainer>
  </React.Fragment>
}

export default DeliveryMinimumPurchaseList
