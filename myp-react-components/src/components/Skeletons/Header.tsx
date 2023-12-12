import React from 'react'
import { HeaderContainer } from './styles'
import { Skeleton } from '@mui/material'

export const HeaderSkeleton: React.FC = () => {
  return (
      <Skeleton variant="rectangular" width="100%">
        <HeaderContainer />
      </Skeleton>
  )
}
