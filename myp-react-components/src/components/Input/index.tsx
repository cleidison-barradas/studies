import React from 'react'
import {
  InputContainer,
  Input as CustomInput,
  StartIconContainer,
} from './styles'

export interface InputProps {
  StartIcon?: React.FC
  color?: 'primary' | 'secondary'
  size?: 'large' | 'medium'
  containerStyle?: React.CSSProperties
}

export const Input: React.FC<
  InputProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>
> = ({
  color = 'primary',
  StartIcon: Icon,
  children,
  size = 'large',
  dangerouslySetInnerHTML,
  containerStyle,
  ...props
}) => {
  return (
    <InputContainer style={containerStyle} color={color}>
      {Icon && (
        <StartIconContainer color={color}> {<Icon />} </StartIconContainer>
      )}
      <CustomInput size={size} {...(props as any)} />
    </InputContainer>
  )
}
