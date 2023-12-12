import React from 'react'
import { Circle } from './styles'

interface PulsingCircleProps {
  color: string
}

export const PulsingCircle: React.FC<PulsingCircleProps> = ({ color }) => {
  return <Circle color={color} />
}
