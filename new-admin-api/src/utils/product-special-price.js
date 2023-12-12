const moment = require('moment')

module.exports = (specials= []) => {
  const _specials = specials.filter(p => {
    const { date_start, date_end } = p

    if (!date_end) return true

    const dateStart = moment(date_start, 'YYYY-MM-DD')
    const dateEnd = moment(date_end, 'YYYY-MM-DD')
    const currentDate = moment()

    return currentDate.isSameOrAfter(dateStart) && currentDate.isSameOrBefore(dateEnd)
  }).map(x => {
    const price = x.price

    return {
      price,
      date_start: x.date_start,
      date_end: x.date_end
    }
  })
  if (_specials.length === 0) return undefined
  else return _specials[0]
}