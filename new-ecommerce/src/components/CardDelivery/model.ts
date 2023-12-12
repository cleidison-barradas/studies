import { Pallete } from '@mypharma/react-components'

export type CardDeliveryData = {
  address: string
  time: string
  isFast: boolean
  isFree: boolean
  channel?: string
  price?: number;
}

export type FastDeliveryProps = {
  pallete: Pallete
  active: boolean
  onClick?: () => void
} & CardDeliveryData
