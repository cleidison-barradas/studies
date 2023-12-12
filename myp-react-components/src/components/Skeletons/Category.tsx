import React from 'react'
import { Skeleton } from '@mui/material'
import { CategoryContainer } from './styles'

export interface CategorySkeletonProps {
    slider?: boolean
}

export const CategorySkeleton: React.FC<CategorySkeletonProps> = ({slider = false}) => {

    if(slider) {
        return (
            <CategoryContainer>
                <Skeleton
                    variant="circular"
                    width="120px"
                    height="120px"
                    style={{position: 'absolute', top: '-60px', zIndex: 2}}
                />
                <Skeleton width="135px" height="50px" variant="text" style={{borderRadius: "24px"}} />
            </CategoryContainer>
        )
    }
    return (
        <CategoryContainer>
            <Skeleton
                variant="circular"
                width="80px"
                height="80px"
                style={{position: 'absolute', top: '-20px', zIndex: 2}}
            />
            <Skeleton width="96px" height="50px" variant="text" style={{borderRadius: "24px"}} />
        </CategoryContainer>
    )
}