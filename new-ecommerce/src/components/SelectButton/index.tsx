import { Box, Button, Stack } from '@mui/material'
import React from 'react'
import { useTheme } from 'styled-components'
import { CircleIcon, NeutralCheckIcon } from '../../assets/icons'

interface SelectButtonProps {
  selected?: boolean
  disabled?: boolean
  onClick?: () => void
}

export const SelectButton: React.FC<SelectButtonProps> = ({ children, selected, disabled, onClick }) => {
  const { color } = useTheme()

  return (
    <Button
      variant="contained"
      disabled={disabled}
      onClick={onClick}
      fullWidth
      style={{
        borderRadius: 6,
        height: 48,
        backgroundColor: selected ? color.primary.medium : color.primary.lightest,
      }}
    >
      <Stack alignItems="center" spacing={2} direction="row">
        <Box>{children}</Box>
        <Box height={24} width={24} color={color.primary.medium}>
          {selected ? <NeutralCheckIcon /> : <CircleIcon />}
        </Box>
      </Stack>
    </Button>
  )
}
