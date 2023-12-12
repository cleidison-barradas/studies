import * as moment from 'moment'

interface SpecialPrice {
  price: number
  date_end: Date
  date_start: Date
}


/**
 * It takes an array of SpecialPrice objects, filters out the ones that are not active, and returns the
 * first one
 * @param {SpecialPrice[]} specials - SpecialPrice[] = []
 * @returns the first special price object that is active.
 */
const getActiveSpecialPrice = (specials: SpecialPrice[] = []): SpecialPrice | undefined => {
  if (!specials || specials.length <= 0) return undefined

  const _specials = specials
    .filter((p) => {
      const { date_start, date_end } = p

      const dateStart = moment(date_start, 'YYYY-MM-DD')
      const dateEnd = moment(date_end, 'YYYY-MM-DD')
      const currentDate = moment()

      return currentDate.isSameOrAfter(dateStart) && currentDate.isSameOrBefore(dateEnd)
    })
    .map((p) => {
      const specialPrice = Number(p.price)

      return {
        price: specialPrice,
        date_start: p.date_start,
        date_end: p.date_end,
      }
    })

  if (_specials.length === 0) return undefined
  else return _specials[0]
}

export default getActiveSpecialPrice
