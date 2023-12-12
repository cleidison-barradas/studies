import moment from 'moment'

interface ISpecials {
  price: number
  date_end: Date
  date_start: Date
}

export const specialPrice = (specials: ISpecials[] = []) => {
  if (!specials || specials.length === 0) return undefined

  let _specials = specials.filter(p => {
    const { date_start, date_end } = p

    const dateStart = moment(date_start, 'YYYY-MM-DD')
    const dateEnd = moment(date_end, 'YYYY-MM-DD')
    const currentDate = moment()

    return currentDate.isSameOrAfter(dateStart) && currentDate.isSameOrBefore(dateEnd)
  }).map(p => {
    const specialPrice = Number(p.price)

    return {
      price: specialPrice,
      date_start: p.date_start,
      date_end: p.date_end
    }
  })

  if (_specials.length === 0) return undefined
  else return _specials[0]
}