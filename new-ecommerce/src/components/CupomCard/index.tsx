import React from 'react'
import { TicketIcon } from '../../assets/icons'
import { CupomContainer, CupomLabel } from './styles'

export const CupomCard: React.FC = () => {
  return (
    <CupomContainer>
      <TicketIcon color="inherit" />
      <CupomLabel>Cupom de Desconto</CupomLabel>
    </CupomContainer>
  )
}
