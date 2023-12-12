import React, { Component } from 'react'
import { Button, Stack, Typography } from '@mui/material'

import { CheckoutDeliveryContainer } from '../CheckoutDeliveryContainer'

import Address from '../../interfaces/address'
import { IShipping } from '../../interfaces/shipping'
import { DeliveryMode } from '../../interfaces/deliveryMode'

interface Props {
  checkoutAddress: Address
  setCheckoutAddress: React.Dispatch<React.SetStateAction<Address | null>>
  setDeliveryMode: React.Dispatch<React.SetStateAction<DeliveryMode>>
  setShipping: React.Dispatch<React.SetStateAction<IShipping | null>>
  onFinish: (value: number) => void
  hasVirtualProducts: boolean
  isAllVirtualProducts: boolean
  handleEditAddress: () => void
}

export class DeliveryTo extends Component<Props> {
  render() {
    const {
      checkoutAddress,
      handleEditAddress,
      isAllVirtualProducts,
      hasVirtualProducts,
      setCheckoutAddress,
      setDeliveryMode,
      setShipping,
      onFinish,
    } = this.props

    return (
      <Stack spacing={2} marginBottom={{ xs: '56px', md: '32px' }}>
        <Stack
          direction='column'
          justifyContent='center'
          alignItems='center'
          gap={1}
          style={{
            border: '1px',
            borderColor: '#FFA4A4',
            borderStyle: 'solid',
            padding: '16px',
            borderRadius: '24px'
          }}
        >
          <Typography fontSize={16}><span style={{ color: '#7A828A' }} >
            Entrega para o CEP:</span> {checkoutAddress.postcode?.replace(/^(\d{5})(\d{3})$/, "$1-$2")}
          </Typography>
          <Typography fontSize={14} color='#474F57'>
            {checkoutAddress.street}, {checkoutAddress.number}, {checkoutAddress.neighborhood.city.name}-{checkoutAddress.neighborhood.city.state.code}
          </Typography>
          <Button
            variant='contained'
            style={{
              backgroundColor: '#E0E8F0',
              color: '#474F57',
              fontWeight: '400'
            }}
            onClick={() => {
              setShipping(null)
              setCheckoutAddress(null)
              setDeliveryMode('will_decide')
            }}
          >
            Alterar endereço
          </Button>
        </Stack>
        <CheckoutDeliveryContainer
          onFinish={() => onFinish(2)}
          hasVirtulProducts={hasVirtualProducts}
          isAllVirtualProducts={isAllVirtualProducts}
          editingAddress={handleEditAddress}
        />
      </Stack>
    )
  }
}

export default DeliveryTo
