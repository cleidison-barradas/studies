import { Popover } from '@material-ui/core'
import React from 'react'
import { Input } from '../'
import {
  InputContainer,
  SearchContainer,
  DropdownContainer,
  SearchCaption,
} from './styles'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  color?: 'primary' | 'secondary'
  searchIcon: React.FC
}

export const SearchDropdown: React.FC<InputProps> = ({
  color = 'primary',
  children,
  searchIcon,
  placeholder,
}) => {
  return (
    <DropdownContainer color={color}>
      <InputContainer color={color}>
        <Input
          containerStyle={{ border: 'none', background: 'transparent' }}
          StartIcon={searchIcon}
          placeholder={placeholder}
        />
      </InputContainer>

      <Popover open={true}>
        <SearchContainer>
          <SearchCaption> Você procura por </SearchCaption>
          {children}
        </SearchContainer>
      </Popover>
    </DropdownContainer>
  )
}
