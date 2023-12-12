import React from 'react'
import { Typography } from '@mui/material'
import PaymentRoundedIcon from '@mui/icons-material/PaymentRounded'

import { useInstallments } from '../../hooks/useInstallments'

import { floatToBRL } from '../../helpers/moneyFormat'

import { CaptionCard } from './styles'

export default function MinValueToInstallmentsCard() {
  const { diffBetweenMinAndCartTotal } = useInstallments()

  return (
    <div style={{ marginTop: 16 }}>
      <CaptionCard>
        <div style={{ padding: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
          <PaymentRoundedIcon />
          <Typography fontSize='inherit'>
            Faltam <strong>{floatToBRL(diffBetweenMinAndCartTotal())}</strong> para habilitar o parcelamento no pagamento online!
          </Typography>
        </div>
      </CaptionCard>
    </div>
  )
}

