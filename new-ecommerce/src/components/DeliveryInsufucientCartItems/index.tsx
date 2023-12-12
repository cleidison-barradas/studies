import React from 'react'
import { SentimentDissatisfied } from '@mui/icons-material'
import { Stack, Typography, Button } from '@mui/material'
import { floatToBRL } from '../../helpers/moneyFormat'
import { CheckoutModal } from '../CheckoutModal'
import { useCart } from '../../hooks/useCart'

interface Props {
  openModal: boolean
  onSelectAddress: () => void
  onSelectProducts: () => void
}

const DeliveryInsufucientCartItems: React.FC<Props> = ({ openModal = false, onSelectAddress, onSelectProducts }) => {
  const { getCartValue } = useCart()
  const { minimumPurchase } = getCartValue()

  return (
    <CheckoutModal open={openModal} disableClose onClose={() => Function}>
      <Stack display='flex' flexDirection='column' alignItems='center'>
        <SentimentDissatisfied style={{ fontSize: 250 }} color='primary' />
        <Typography fontSize={18}>O pedido mínimo para este local é: {floatToBRL(minimumPurchase)}</Typography>
        <Stack display='flex' flexDirection='column' marginTop={2} width='100%' >
          <Button
            fullWidth
            disableElevation
            color="secondary"
            variant="contained"
            style={{ marginBottom: 10 }}
            onClick={onSelectProducts}
          >
            Adicionar mais produtos
          </Button>
          <Button
            fullWidth
            disableElevation
            color={'inherit'}
            variant="outlined"
            style={{ color: '#787878', borderColor: '#787878' }}
            onClick={onSelectAddress}
          >Escolher outro endereço</Button>
        </Stack>
      </Stack>
    </CheckoutModal>
  )
}

export default DeliveryInsufucientCartItems
