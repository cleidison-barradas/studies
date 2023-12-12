import { Skeleton } from '@mui/material'
import React from 'react'
import { ProductContainer, ProductInfo, Tag } from './styles'

export const ProductSkeleton: React.FC = () => {
    return (
        <ProductContainer>
            <Skeleton width="100%" height="140px" variant="rectangular" style={{borderRadius: "16px"}} />
            <Skeleton component={Tag} variant="rectangular" style={{borderRadius:"16px"}} />
            <Skeleton component={Tag} variant="rectangular" style={{borderRadius:"16px"}} />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton component={ProductInfo} variant="rectangular" style={{borderRadius: "16px"}} />
            <Skeleton component={ProductInfo} variant="rectangular" style={{borderRadius: "16px"}} />
            <Skeleton width="100%" height="32px" variant="rectangular" style={{borderRadius: "30px"}} />
        </ProductContainer>
    )
}

export const TitleSkeleton: React.FC = () => {
    return (
        <Skeleton width="313px" height="54px" style={{borderRadius: "24px"}} variant="rectangular" />
    )
}
