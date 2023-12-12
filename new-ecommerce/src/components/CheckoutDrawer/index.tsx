import { Stack, SwipeableDrawer, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useTheme } from 'styled-components'
import { DropdownIcon } from '../../assets/icons'
import { floatToBRL } from '../../helpers/moneyFormat'
import { useCart } from '../../hooks/useCart'
import { CupomCard } from '../CupomCard'
import { OrderDetail } from '../OrderDetail'

interface CheckoutDrawerProps {
  step: number
}

export const CheckoutDrawer: React.FC<CheckoutDrawerProps> = ({ step }) => {
  const { color } = useTheme()
  const [open, setOpen] = useState(false)

  const { getCartValue } = useCart()

  const closeDrawer = () => {
    setOpen(false)
  }

  return (
    <React.Fragment>
      <Stack
        direction="row"
        justifyContent="space-between"
        borderTop={`1px solid ${color.neutral.light} `}
        borderBottom={`1px solid ${color.neutral.light} `}
        alignItems="center"
        padding="8px 16px 8px 22px"
        onClick={() => setOpen(true)}
      >
        <DropdownIcon />
        <Stack>
          <Typography>Detalhes do Pedido</Typography>
          <Typography color={color.neutral.darkest}>
            {floatToBRL(getCartValue().subTotal)}
          </Typography>
        </Stack>
        <CupomCard />
      </Stack>
      <SwipeableDrawer
        sx={{
          '& .MuiDrawer-paper': {
            borderRadius: '24px 24px 0 0',
          },
        }}
        onOpen={() => setOpen(true)}
        open={open}
        onClose={closeDrawer}
        anchor={'bottom'}
      >
        <OrderDetail step={step} onClose={closeDrawer} />
      </SwipeableDrawer>
    </React.Fragment>
  )
}
