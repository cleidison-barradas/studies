import { Product } from '@mypharma/api-core'
import ProductCountService from '../service/ProductCountService'

const productCountService = new ProductCountService()

const allTrim = (string: string) => string.replace(/\s+/g, ' ').replace(/^\s+|\s+$/, '')

const formatString = (string: string) => allTrim(string.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, '')).replace(/\s/g, '-')

export const generateSlug = async (product: Product, tenant: string) => {
  let slug = formatString(product.name)

  if (product.name && product.name.length > 0) {
    slug += `-${formatString(product.name)}`
  }

  if (product.manufacturer && product.manufacturer.name && product.manufacturer.name.length > 0) {
    slug += `-${formatString(product.manufacturer.name)}`
  }

  slug += `-${formatString(product.EAN)}`

  // Check if already exists
  const count = await productCountService.productCount({ tenant, slug })

  if (count > 0) {
    slug += `-${count + 1}`
  }

  return slug
}