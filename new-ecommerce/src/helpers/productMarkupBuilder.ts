import { CDN } from '../config/keys'
import Product from '../interfaces/product'
import { getProductActivePromotion } from './getProductActivePromotion'

export const markupBuilder = (product: Product) => {
  const { image, name, EAN, prensentation, price, quantity } = product

  let availability = 'http://schema.org/InStock'

  if (quantity > 0 && quantity <= 5) {
    availability = 'http://schema.org/LimitedAvailability'
  }
  if (quantity <= 0) {
    availability = 'http://schema.org/OutOfStock'
  }

  const markup = {
    '@context': 'http://schema.org/',
    '@type': 'Product',
    name: `${name} ${prensentation}`,
    image: `${CDN.image}${image?.key}`,
    gtin: EAN,
    sku: EAN,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'BRL',
      price: getProductActivePromotion(product)
        ? getProductActivePromotion(product)!.price.toFixed(2)
        : price.toFixed(2),
      availability,
    },
  }

  return JSON.stringify(markup)
}
