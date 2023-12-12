
export function ProductDiscountPercentage(price: number, percentage: number = 0) {
  if (percentage === 0) return price

  const discount = price * (percentage / 100)

  return price - discount

}