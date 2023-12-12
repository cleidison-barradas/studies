import React from 'react'
import { Button } from './styles'

export interface FloatingButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  color: string
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  children,
  color,
  onClick,
}) => {
  return (
    <Button color={color} onClick={onClick}>
      {children}
    </Button>
  )
}
