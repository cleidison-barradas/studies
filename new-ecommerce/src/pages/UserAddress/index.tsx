import { Stack, Button, Typography } from '@mui/material'
import React, { useContext } from 'react'
import { useNavigate } from 'react-router'
import useSWR, { mutate } from 'swr'
import { NoAddressIcon } from '../../assets/icons'
import { AddressCard } from '../../components/AddressCard'
import { ReturnButton } from '../../components/ReturnButton'
import AuthContext from '../../contexts/auth.context'
import { AddressForm } from '../../forms/AddressForm'
import Address from '../../interfaces/address'
import { getAddresses } from '../../services/address/address.service'

export const UserAddress: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const { data } = useSWR(`addresses/${user?._id}`, getAddresses, { revalidateOnFocus: false })

  const handleOpenEdit = (address: Address) => {
    navigate(`/user/address/${address._id}`)
  }

  const onFinishAddressForm = async () => {
    await mutate(`addresses/${user?._id}`)
  }

  return (
    <React.Fragment>
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} p={3}>
        <ReturnButton onClick={() => navigate(-1)} />
        <Typography fontSize={24} fontWeight={400}>
          Endereços
        </Typography>
      </Stack>
      {data?.addresses && data.addresses.length > 0 ? (
        <Stack alignItems="center" spacing={1}>
          {data.addresses
            .filter((value) => value.isMain)
            .map((address) => (
              <AddressCard key={address._id} address={address} handleOpenEdit={handleOpenEdit} />
            ))}
          {data.addresses
            .filter((value) => !value.isMain)
            .map((address) => (
              <AddressCard key={address._id} address={address} handleOpenEdit={handleOpenEdit} />
            ))}
          <Button onClick={() => navigate('/user/address/new')}>Adicionar novo endereço</Button>
        </Stack>
      ) : (
        <Stack spacing={3} alignItems="center" justifyContent="center">
          <NoAddressIcon />
          <Typography fontSize={14}>
            Ainda não possui nenhum endereço salvo, adicione um agora mesmo!
          </Typography>
          <AddressForm onFinish={onFinishAddressForm} />
        </Stack>
      )}
    </React.Fragment>
  )
}
