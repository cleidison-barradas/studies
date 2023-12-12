import { Product } from '@mypharma/api-core'
import { endOfDay, isBefore, isWithinInterval } from 'date-fns'

export function getProductActivePromotion(product: Product) {
  const { specials = [] } = product

  return specials.find(({ date_end = endOfDay(new Date()), date_start }) => {
    if (!date_end) {
      return isBefore(new Date(date_start), new Date())
    }
    return isWithinInterval(new Date(), { start: new Date(date_start), end: new Date(date_end) })
  })
}
