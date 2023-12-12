import { alpha } from '@mui/material'
import styled from 'styled-components'

export const ButtonIcon = styled('span')`
  position: absolute;
  left: 10px;
  top: -10px;

  min-height: 24px;
  min-width: 24px;

  .MuiChip-root {
    background-color: ${({ theme }) => theme.color.secondary.medium}};
  }
`

export const TooltipWrapper = styled.span`
  .MuiTooltip-popper[data-popper-placement*='top'] {
    margin-bottom: 0px;
  }
  .MuiTooltip-arrow {
    color: ${({ theme }) => alpha(theme.color.secondary.medium, 0.92)};
  }
`

export const Container = styled('div')`
  position: fixed;
  bottom: 0px;

  height: 72px;
  width: 100%;

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
  color: ${({ theme, active }) => (active ? theme.color.primary.medium : theme.color.neutral.dark)};
  background: none;

  height: 100%;
  width: 72px;

  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  align-items: center;
  gap: 3px;

  font-size: 8px;
  line-height: 16px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  text-align: center;

  position: relative;

  &:active {
    color: ${({ theme }) => theme.color.neutral.dark};
  }

  svg {
    height: 22px;
    width: 22px;
  }
`
