import React, { useContext, useState } from 'react'
import { EditIcon, TrashIcon } from '../../assets/icons'
import Address from '../../interfaces/address'
import { CardContainer, CardInfo } from './styles'
import { CircularProgress, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { deleteAddress } from '../../services/address/address.service'
import { mutate } from 'swr'
import AuthContext from '../../contexts/auth.context'

interface AddressCardProps {
  address: Address
  handleOpenEdit?: (address: Address) => void
  selected?: boolean
  hideRemove?: boolean
}

export const AddressCard: React.FC<AddressCardProps> = ({
  address,
  handleOpenEdit,
  selected,
  hideRemove,
}) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const { user } = useContext(AuthContext)

  const handleRemove = async () => {
    setIsDeleting(true)
    await deleteAddress(address._id!)
    await mutate(`addresses/${user?._id}`)
    setIsDeleting(false)
  }

  return (
    <CardContainer selected={selected !== undefined ? selected : address.isMain}>
      <CardInfo>
        <Typography fontSize={14}>
          {address.street} {address.number ? `, ${address.number}` : ''}
          {address.isMain ? ' (Principal)' : ''}
        </Typography>
        <Typography fontSize={12}>
          {address.neighborhood.name}, {address.neighborhood.city.name}-
          {address.neighborhood.city.state.code}
        </Typography>
      </CardInfo>
      <Stack direction="row" gap={2}>
        {handleOpenEdit && (
          <Tooltip title="Editar">
            <IconButton onClick={() => handleOpenEdit(address)} color="primary">
              <EditIcon />
            </IconButton>
          </Tooltip>
        )}
        {!hideRemove && (
          <Tooltip title="Excluir">
            <IconButton
              disabled={isDeleting}
              color={!isDeleting ? 'error' : 'primary'}
              onClick={handleRemove}
            >
              {isDeleting ? <CircularProgress size={20} /> : <TrashIcon />}
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </CardContainer>
  )
}
