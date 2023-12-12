import React from 'react'
import { Container } from './styles'

export interface TabBarProps {}

export const TabBar: React.FC = ({ children }) => {
  return <Container> {children} </Container>
}
