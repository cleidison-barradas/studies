import moment from 'moment'

interface ISpecialPrice {
  date_start: Date
  date_end: Date
  price: number
}

/**
 * It takes an array of special prices, filters out the ones that are not active, and returns the first
 * one
 * @param {ISpecialPrice[]} specials - ISpecialPrice[] = []
 */
export function getActiveSpecialPrice(specials: ISpecialPrice[] = []) {
  if (!specials || specials.length <= 0) return undefined
  const currentDate = moment()

  return specials.find(special =>
    currentDate.isBetween(special.date_start, special.date_end))

}