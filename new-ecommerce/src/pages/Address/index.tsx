import { Stack, Typography } from '@mui/material'
import React, { useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR, { mutate } from 'swr'
import { ReturnButton } from '../../components/ReturnButton'
import AuthContext from '../../contexts/auth.context'
import { AddressForm } from '../../forms/AddressForm'
import { getAddresses } from '../../services/address/address.service'

export const Address: React.FC = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const { addressId } = useParams()

  const { data } = useSWR(
    addressId !== 'new' ? `addresses/${user?._id}` : undefined,
    getAddresses,
    { revalidateOnFocus: false }
  )

  const onFinish = async () => {
    if (addressId !== 'new') await mutate(`addresses/${user?._id}`)
    navigate(-1)
  }

  return (
    <React.Fragment>
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} p={3}>
        <ReturnButton onClick={() => navigate(-1)} />
        <Typography fontSize={24} fontWeight={400}>
          {addressId !== 'new' ? 'Editar endereço' : 'Criar novo endereço'}
        </Typography>
      </Stack>
      <AddressForm
        onFinish={onFinish}
        address={data?.addresses?.find((value) => value._id === addressId)}
      />
    </React.Fragment>
  )
}
