import { useState } from 'react'

import CardDelivery from '../CardDelivery'

import { ChooseDeliveryProps } from './model'
import { ChooseDeliveryStyled } from './styles'

export const ChooseDelivery = ({ deliveries, ...props }: ChooseDeliveryProps) => {
  const [active, setActive] = useState(0)

  return (
    <ChooseDeliveryStyled>
      {deliveries.map((delivery, index) => (
        <CardDelivery
          {...props}
          {...delivery}
          key={index}
          active={active === index}
          onClick={() => setActive(index)}
        />
      ))}
    </ChooseDeliveryStyled>
  )
}

export default ChooseDelivery
