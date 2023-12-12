import React from 'react'
import { Stack, Box, Typography } from '@mui/material'
import { StoreBranchPickupCard } from '../StoreBranchPickupCard'
import { StoreBranchPickup } from '../../interfaces/storeBranchPickup'

interface StorePickupbranchListProps {
  onSelect: (branchPickup: StoreBranchPickup | null) => void
  selectedStoreBranch: StoreBranchPickup | null
  branchesPickup: StoreBranchPickup[]
}

export const StoreBranchPickupList: React.FC<StorePickupbranchListProps> = ({
  onSelect,
  selectedStoreBranch,
  branchesPickup,
}) => {
  return (
    <Stack marginBottom={{ xs: '56px' }}>
      <Stack direction="column" spacing={2} alignItems="center">
        {branchesPickup && branchesPickup.length > 0 && (
          <Typography alignSelf="flex-start">Selecione uma filial</Typography>
        )}

        {branchesPickup &&
          branchesPickup.map((storeBranch) => (
            <Box
              key={storeBranch._id}
              width="100%"
              style={{ cursor: 'pointer' }}
              onClick={() => onSelect(storeBranch)}
            >
              <StoreBranchPickupCard
                key={storeBranch._id}
                selected={selectedStoreBranch ? selectedStoreBranch._id === storeBranch._id : false}
                branchPickup={storeBranch}
              />
            </Box>
          ))}
      </Stack>
    </Stack>
  )
}
