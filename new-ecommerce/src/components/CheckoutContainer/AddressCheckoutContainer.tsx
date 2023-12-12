import { Stack } from '@mui/material'
import React from 'react'
import { AddressForm } from '../../forms/AddressForm'

interface AddressCheckoutContainerProps {
  onFinish: () => void
}

export const AddressCheckoutContainer: React.FC<AddressCheckoutContainerProps> = ({onFinish}) => {
    return (
        <Stack flex={1}>
            <AddressForm onFinish={onFinish} />
        </Stack>
    )
}
