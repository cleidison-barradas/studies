import * as moment from 'moment'

interface SpecialsDTO {
  price: number,
  date_start: Date,
  date_end: Date
}

export default function SpecialPrice(_specials: SpecialsDTO[] = []):SpecialsDTO  {
  if (_specials.length <= 0) return undefined
  
  const specials = _specials.filter(special => {
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

  if (specials.length === 0) return undefined
  else return specials[0]
}