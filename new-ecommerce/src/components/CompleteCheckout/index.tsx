import React, { useContext } from 'react'
import AuthContext from '../../contexts/auth.context'
import { CompleteCheckoutform } from '../../forms/CompleteCheckoutForm'
import { Container } from './styles'

type Props = {
  cpfRequired?: boolean
  onUpdate: () => void
}

export const CompleteCheckout: React.FC<Props> = ({ onUpdate, cpfRequired }) => {
  const { user } = useContext(AuthContext)

  return (
    <Container>
      <CompleteCheckoutform user={user} cpfRequired={cpfRequired} onFinish={onUpdate} />
    </Container>
  )
}
