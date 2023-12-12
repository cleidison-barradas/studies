import React from 'react'
import { HeaderContainer } from './styles'

export interface HeaderProps {
  color?: 'primary' | 'secondary'
}

export const Header: React.FC<HeaderProps> = ({
  color = 'primary',
  children,
}) => {
  return <HeaderContainer color={color}> {children} </HeaderContainer>
}
