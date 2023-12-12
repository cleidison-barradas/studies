import { isAfter } from 'date-fns'

export function isValidDate(value?: string) {

  const data = value?.replace(/\D+/g, '')

  if (!data || data.length <= 0) return false

  const [day, month, year] = value?.split('/') || ['', '', '']

  const date = new Date(Number(year), Number(month) - 1, Number(day))

  return isAfter(new Date(), date)

}
