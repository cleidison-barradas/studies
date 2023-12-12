import { format } from 'date-fns'

export function fDate(date: Date | string | number) {
  const formattedDate = typeof date === 'string' ? new Date(date.replace(/-/g, '/')) : new Date(date)
  return format(formattedDate, 'dd/MM/yyyy')
}
