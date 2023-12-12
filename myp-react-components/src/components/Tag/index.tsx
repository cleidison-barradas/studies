import React from 'react'
import { TagContainer } from './styles'

export interface TagProps {
  color: 'freeShipping' | 'promotional' | 'discount'
}

export const Tag: React.FC<TagProps> = ({ children, color }) => {
  return <TagContainer color={color}>{children}</TagContainer>
}
