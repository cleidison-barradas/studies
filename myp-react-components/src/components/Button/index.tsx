import React from 'react'
import { PaletteBorder } from 'src'
import { Button as CustomButton } from './styles'

export interface ButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  color?: 'primary' | 'secondary'
  variant?: 'outlined' | 'filled'
  size?: 'large' | 'medium' | 'small'
  disabled?: boolean
  fullWidth?: boolean
  textBlack?: boolean
  borderRadius?: keyof PaletteBorder['radius']
  uppercase?: boolean
  textColor?: string
  style?: React.CSSProperties
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  color = 'primary',
  children,
  variant = 'outlined',
  disabled = false,
  size = 'medium',
  fullWidth = true,
  textBlack = false,
  borderRadius = 'lg',
  uppercase,
  textColor,
  style={}
}) => {
  return (
    <CustomButton
      size={size}
      disabled={disabled}
      variant={variant}
      color={color}
      onClick={onClick}
      fullWidth={fullWidth}
      textBlack={textBlack}
      borderRadius={borderRadius}
      uppercase={uppercase}
      textColor={textColor}
      style={style}
    >
      {children}
    </CustomButton>
  )
}
