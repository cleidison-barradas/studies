import { Skeleton } from '@mui/material'
import React from 'react'
import { Banner } from './styles'

export const BannerSkeleton: React.FC = () => {
    return (
        <Skeleton variant="rectangular" style={{borderRadius: "24px"}}>
            <Banner />
        </Skeleton>
    )
}
