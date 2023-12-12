import React from 'react'
import { Container } from './styles'

export interface BannerProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  image: string
  text: string
  disabled?: boolean
}

export const Banner: React.FC<BannerProps> = ({
  onClick,
  image,
  text,
  disabled,
}) => {
  return (
    <Container disabled={disabled} onClick={onClick} src={image}>
      {text}
    </Container>
  )
}
