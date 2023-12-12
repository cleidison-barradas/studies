import * as moment from 'moment'

interface ISpecialPrice {
  price: number
  date_end: Date
  date_start: Date
}

export function specialPrice(specials: ISpecialPrice[] = []) {
  if (specials.length === 0) return undefined

  const _specials = specials.filter(special => {
    const { date_end, date_start } = special

    const dateStart = moment(date_start, 'YYYY-MM-DD')
    const dateEnd = moment(date_end, 'YYYY-MM-DD')
    const currentDate = moment()

    return currentDate.isSameOrAfter(dateStart) && currentDate.isSameOrBefore(dateEnd)
  }).map(_s => {
    const price = _s.price

    return {
      price,
      date_start: _s.date_start,
      date_end: _s.date_end
    }
  })

  if (_specials.length === 0) return undefined
  else return _specials[0]
}