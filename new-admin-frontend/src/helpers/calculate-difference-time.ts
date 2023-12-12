import moment from 'moment'

interface CalculateDifferenceTimeRequest {
  currentDate: string | Date
  dueDate: string | Date
}

export function calculateDifferenceTime({
  currentDate,
  dueDate,
}: CalculateDifferenceTimeRequest) {
  const diffDuration = moment.duration(moment(dueDate).diff(moment(currentDate)))

  const days = Math.floor(diffDuration.asDays())
  diffDuration.subtract(days, 'days')

  const hours = diffDuration.hours()
  const minutes = diffDuration.minutes()

  return {
    days,
    hours,
    minutes,
  }
}
