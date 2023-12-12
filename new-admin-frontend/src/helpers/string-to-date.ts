export default function stringToDate(rawString: string): Date {
  const date = new Date()
  switch (rawString) {
    case '30daysAgo':
    date.setDate(date.getDate() - 30)
    break
    case '15daysAgo':
    date.setDate(date.getDate() - 15)
    break
    case '7daysAgo':
    date.setDate(date.getDate() - 7)
    break
    case 'yesterday':
    date.setDate(date.getDate() - 1)
    break
    case 'today':
    date.setHours(0,0,0,0)
    break
  }

  return date
}