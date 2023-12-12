export const getPercentage = (firstValue: number, secondValue: number) => {
  const percentage = Math.abs(Math.floor((secondValue / firstValue - 1) * 100))

  return `${percentage}% OFF`
}
