export const getProductPrice = (
  price: number,
  promotional?: number,
  cupomDiscount?: number,
  fromPaymentLink?: boolean
) => {
  if (promotional && cupomDiscount) {
    if (promotional > cupomDiscount) return cupomDiscount
    else return promotional
  }
  if (promotional && !cupomDiscount && !fromPaymentLink) return promotional
  if (!promotional && cupomDiscount) return cupomDiscount

  return price
}
