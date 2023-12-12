import Product from '../interfaces/product'
import { endOfDay, startOfDay, parseISO, isWithinInterval } from 'date-fns'

export function getProductActivePromotion(product: Product) {
  const specials = product?.specials || []

  if (!specials || specials.length <= 0) return undefined
  const today = new Date()

  return specials.find(_special =>
    isWithinInterval(today, {
      start: startOfDay(parseISO(_special.date_start.toString())),
      end: endOfDay(parseISO(_special.date_end.toString()))
    }))
}
