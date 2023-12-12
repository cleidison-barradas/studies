export function formatNumberToTwoDigits(number: number) {
  if (number < 10) return `0${number}`
  return number
}

export const minutesToTime = (minutes: number) => {
  if (minutes < 60) {
    return {
      value: formatNumberToTwoDigits(minutes),
      suffix: 'min',
    }
  }

  if (minutes >= 60 && minutes < 1440) {
    return {
      value: formatNumberToTwoDigits(Number((minutes / 60).toFixed(0))),
      suffix: 'h',
    }
  }

  return {
    value: formatNumberToTwoDigits(Number((minutes / 1440).toFixed(0))),
    suffix: 'dias',
  }
}
