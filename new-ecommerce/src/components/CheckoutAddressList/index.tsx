import { Stack, Box, Typography } from '@mui/material'
import React, { useContext } from 'react'
import { useNavigate } from 'react-router'
import useSWR from 'swr'
import AuthContext from '../../contexts/auth.context'
import Address from '../../interfaces/address'
import { getAddresses } from '../../services/address/address.service'
import { AddressCard } from '../AddressCard'

interface CheckoutAddressListProps {
  onSelect: (address: Address | null) => void
  selected: Address | null
}

export const CheckoutAddressList: React.FC<CheckoutAddressListProps> = ({ onSelect, selected }) => {
  const { user } = useContext(AuthContext)
  const { data } = useSWR(`addresses/${user?._id}`, getAddresses)
  const navigate = useNavigate()
  const addresses = data ? data.addresses : []

  return (
    <Stack marginBottom={{ xs: '56px' }}>
      <Stack direction="column-reverse" spacing={2} alignItems="center">
        {addresses.map((address) => (
          <Box
            key={address._id}
            width="100%"
            style={{ cursor: 'pointer' }}
            onClick={() => onSelect(address)}
          >
            <AddressCard
              selected={selected?._id === address._id}
              key={address._id}
              address={address}
              handleOpenEdit={() => navigate(`/user/address/${address._id}`)}
            />
          </Box>
        ))}
        {addresses.length > 0 && (
          <Typography alignSelf="flex-start">Selecione um endereço</Typography>
        )}
      </Stack>
    </Stack>
  )
}
