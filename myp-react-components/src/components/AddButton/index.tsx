import React from 'react'
import { Container, Input, RoundButton } from './styles'
import { IconButton } from '@mui/material'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
export interface AddButtonProps {
  onClick?: (value: number, event: 'decrease' | 'increase' | 'type') => void
  color?: 'primary' | 'secondary'
  value?: number
  disabled?: boolean
  maxWidth?: boolean
  disableIncrease?: boolean
  disableDecrease?: boolean
  removeDecrease?: boolean
  hasValueOne?: boolean
}

export const AddButton: React.FC<AddButtonProps> = ({
  onClick = () => '',
  color = 'primary',
  value = 0,
  disabled = false,
  maxWidth = false,
  hasValueOne = false,
  disableIncrease = false,
  disableDecrease = false,
  removeDecrease = false,
}) => {
  return (
    <Container maxWidth={maxWidth} disabled={disabled} color={color}>
      {hasValueOne ? (
        <IconButton onClick={() => onClick(value - 1, 'decrease')}>
          <DeleteOutlinedIcon />
        </IconButton>
      ) : (<RoundButton
        disabled={disabled || removeDecrease}
        btnType="remove"
        color={color}
        onClick={() => onClick(value - 1, 'decrease')}
      >
        {!removeDecrease ? '-' : ''}
      </RoundButton>
      )}
      <Input
        disabled={disabled || disableDecrease}
        onChange={(e) => onClick(Number(e.target.value), 'type')}
        value={value}
        color={color}
      />
      <RoundButton
        disabled={disabled || disableIncrease}
        btnType="add"
        color={color}
        onClick={() => onClick(value + 1, 'increase')}
      >
        +
      </RoundButton>
    </Container>
  )
}
