import React from 'react'
import { CardContainer, CardInfo } from './styles'
import { Typography } from '@mui/material'
import { StoreBranchPickup } from '../../interfaces/storeBranchPickup'

interface BranchPickupCardProps {
  branchPickup: StoreBranchPickup
  selected?: boolean
}

export const StoreBranchPickupCard: React.FC<BranchPickupCardProps> = ({
  branchPickup,
  selected,
}) => {
  const { address, name } = branchPickup
  return (
    <CardContainer selected={selected !== undefined ? selected : false}>
      {address && (
        <CardInfo>
          {name && (
            <Typography fontSize={15} fontWeight={'bold'}>
              {name}
            </Typography>
          )}
          <Typography fontSize={14}>
            {address.street} {address.number ? `, ${address.number}` : ''}
            {address.isMain ? ' (Principal)' : ''}
          </Typography>
          <Typography fontSize={12}>
            {address.neighborhood.name}, {address.neighborhood.city.name}-
            {address.neighborhood.city.state.name}
          </Typography>
          <Typography fontSize={12}>{address.complement} </Typography>
        </CardInfo>
      )}
    </CardContainer>
  )
}
