import Icon from 'react-inlinesvg'

import CustomTag from '../CustomTag'

import { FastDeliveryProps } from './model'
import { FastDeliveryContainer } from './styles'

import clockIcon from '../../assets/icons/ClockIcon.svg'
import locationIcon from '../../assets/icons/LocationIcon.svg'
import cartFast from '../../assets/icons/CartFast.svg'

export const CardDelivery = (props: FastDeliveryProps) => {
  const { address, time, pallete, price, channel, isFree, isFast } = props

  return (
    <FastDeliveryContainer {...props}>
      <div>
        <div>
          <Icon src={locationIcon} />
          <span>{address}</span>
        </div>

        <div>
          {time}

          <Icon src={clockIcon} />
        </div>
      </div>
      {isFast ? (
        <>
          <CustomTag
            icon={<Icon src={cartFast} width={15} />}
            color={isFree ? '#006900' : pallete.primary.dark}
            background={isFree ? '#B7FFCC' : pallete.feedback.focus.lightest}
            label={isFree ? 'Rápido e grátis' : 'Rápido'}
          />
          Chegará em até {time} se pedir agora.
        </>
      ) : (
        <footer>
          <p>{channel}</p>

          <span>
            Frete em média de{' '}
            {Intl.NumberFormat('pt-BR', { currency: 'BRL', style: 'currency' }).format(price || 0)}
          </span>
        </footer>
      )}
    </FastDeliveryContainer>
  )
}

export default CardDelivery
