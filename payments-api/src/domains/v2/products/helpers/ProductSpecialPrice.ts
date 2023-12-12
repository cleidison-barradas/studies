import * as moment from 'moment'

interface ProductSpecials {
  price: number
  date_start: Date
  date_end: Date
}

export function ProductSpecialPrice(specials: ProductSpecials[] = []) {
  if (specials.length <= 0) return undefined
  const currentDate = moment()

  return specials.find(special =>
    currentDate.isBetween(special.date_start, special.date_end))

}