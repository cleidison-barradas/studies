import { TextField, TextFieldProps } from '@mui/material'
import React from 'react'
import InputMask, { Props } from 'react-input-mask'

export const MaskedInput: React.FC<Props & TextFieldProps> = ({
  onChange,
  onFocus,
  onBlur,
  value,
  mask,
  ...props
}) => {
  return (
    <InputMask mask={mask} onChange={onChange} value={value} onBlur={onBlur} onFocus={onFocus}>
      {(inputProps: any) => <TextField {...inputProps} {...props} />}
    </InputMask>
  )
}
