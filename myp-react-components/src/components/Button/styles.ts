import PalleteBorder from 'src/interfaces/PaletteBorder'
import styled from 'styled-components'
import ColorProps from '../../interfaces/ColorProps'

interface ButtonProps extends ColorProps {
  variant: 'outlined' | 'filled'
  size: 'large' | 'medium' | 'small'
  fullWidth: boolean
  textBlack: boolean
  borderRadius: keyof PalleteBorder['radius']
  uppercase?: boolean
  textColor?: string
}

const sizeToHeight = {
  small: '32px',
  medium: '40px',
  large: '56px',
}

const sizeToWidth = {
  small: '124px',
  medium: '124px',
  large: '160px',
}

export const Button = styled('button')<ButtonProps>`
  height: ${({ size }) => sizeToHeight[size]};
  width: ${({ size, fullWidth }) => (fullWidth ? '100%' : sizeToWidth[size])};

  border-radius: ${({ theme }) => theme.border.radius.pill};

  color: ${({ color, theme, variant, textBlack, textColor }) =>
    textColor
      ? textColor
      : textBlack
      ? theme.color.neutral.darkest
      : variant === 'outlined'
      ? theme.color[color].dark
      : theme.color.neutral.lightest};

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  outline: none;

  text-transform: ${({ uppercase }) => (uppercase ? 'uppercase' : 'none')};

  border: ${({ color, theme, variant }) =>
    variant === 'outlined'
      ? `${theme.border.width.thin} solid ${theme.color[color].medium}`
      : 'none'};

  background: ${({ color, theme, variant }) =>
    variant === 'outlined' ? 'transparent' : theme.color[color].medium};

  font-size: 14px;
  line-height: 18px;
  font-weight: normal;
  font-style: normal;

  transition: all 200ms ease-in;

  &:hover {
    background: ${({ theme, color }) => theme.color[color].dark};
  }

  &:disabled {
    background: ${({ theme }) => theme.color.neutral.light};
    color: ${({ theme }) => theme.color.neutral.darkest};
    border: none;
  }
`
