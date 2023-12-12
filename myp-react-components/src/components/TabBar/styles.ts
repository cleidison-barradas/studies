import { alpha } from '@material-ui/core'
import styled from 'styled-components'

export const Container = styled('div')`
  position: fixed;
  bottom: 0px;

  height: 72px;
  width: 100vw;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: #ffffff;
  
  z-index: 1;

  border-top: 1px solid ${({ theme }) => alpha(theme.color.neutral.dark, 0.1)};
`

export interface TabBarButtonProps {
  active?: boolean
}

export const TabBarButton = styled.button<TabBarButtonProps>`
  border: none;
  color: ${({ theme, active }) =>
    active ? theme.color.primary.medium : theme.color.neutral.dark};
  background: none;

  height: 100%;
  width: 72px;

  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: space-between;
  align-items: center;
  gap: 3px;

  font-size: 6px;
  line-height: 16px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  text-align: center;

  padding-bottom: 12px;
  padding-top: 22px;

  &:hover {
    color: ${({ theme }) => theme.color.primary.medium};
  }

  &:active {
    color: ${({ theme }) => theme.color.neutral.dark};
  }
`
