import React from 'react'
import { BackArrowIcon } from '../../assets/icons'
import { Button } from './styles'

interface ReturnButtonProps {
  onClick?: (e: any) => void
}

export const ReturnButton: React.FC<ReturnButtonProps> = ({ onClick }) => {
  return (
    <Button type="button" onClick={onClick}>
      <BackArrowIcon />
    </Button>
  )
}
