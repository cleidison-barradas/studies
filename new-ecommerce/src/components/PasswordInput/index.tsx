import { IconButton, InputAdornment, TextField, TextFieldProps } from '@mui/material'
import React, { useState } from 'react'
import { useTheme } from 'styled-components'
import { EyeIcon, BlockedEyeIcon } from '../../assets/icons'

export const PasswordInput: React.FC<TextFieldProps> = (props) => {
  const { color } = useTheme()
  const [isHidden, setIsHidden] = useState(true)

  const handleClick = () => {
    setIsHidden((value) => (value ? false : true))
  }

  return (
    <TextField
      {...props}
      type={isHidden ? 'password' : 'text'}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleClick}>
              {isHidden ? (
                <EyeIcon height={24} color={color.neutral.medium} />
              ) : (
                <BlockedEyeIcon height={24} color={color.neutral.medium} />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  )
}
