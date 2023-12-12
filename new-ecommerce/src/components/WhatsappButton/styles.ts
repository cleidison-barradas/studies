import { alpha, hexToRgb } from '@mui/material'
import styled from 'styled-components'

interface LinkProps {
  color: string
}

export const Link = styled.a<LinkProps>`
  background-color: ${({ color }) => color};
  position: fixed;
  z-index: 1;
  bottom: 105px;
  right: 16px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;

  &:hover {
    box-shadow: 5px 10px 40px ${({ color }) => alpha(hexToRgb(color), 0.5)};
  }

  &:active {
    box-shadow: none;
    opacity: 0.5;
  }

  @media (min-width: 768px) {
    right: 36px;
  }
`
