import { Stack, Typography } from '@mui/material'
import React from 'react'
import { AddressForm } from '../../forms/AddressForm'
import { ReturnButton } from '../ReturnButton'

interface CheckoutAddressContainerProps {
  onReturn: () => any
  onFinish: () => any
  shouldHideReturn?: boolean
}

export const CheckoutAddressContainer: React.FC<CheckoutAddressContainerProps> = ({
  onReturn,
  onFinish,
  shouldHideReturn,
}) => {
  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" spacing={2}>
        {!shouldHideReturn && <ReturnButton onClick={onReturn} />}
        <Typography fontSize={20}>Cadastre um endereço</Typography>
      </Stack>
      <AddressForm buttonColor="secondary" onFinish={onFinish} />
    </Stack>
  )
}
