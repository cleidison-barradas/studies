import { Product } from '@mypharma/api-core'
import ProductToErpCountService from '../service/ProductToErpCountService'

const productToErpCountService = new ProductToErpCountService()

const allTrim = (string: string) => string.replace(/\s+/g, ' ').replace(/^\s+|\s+$/, '')

export const formatString = (string: string) => {
  if (typeof string === 'string') {
    return allTrim(string.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, '')).replace(/\s/g, '-')
  }
  return ''
}

export const generateBaseSlug = async (product: Product | any) => {
  let slug: string = ""

  if (product.name && product.name.length > 0) {
    slug += `${formatString(product.name)}`
  }

  if (product.manufacturer && product.manufacturer.name && product.manufacturer.name.length > 0) {
    slug += `-${formatString(product.manufacturer.name)}`
  }

  slug += `-${formatString(product.EAN)}`

  return slug

}

const getProductCountBySlug = async (slug: string, tenant: string) => {
  const count = await productToErpCountService.productCount({ tenant, slug })

  return count
}

export const generateSlug = async (product: Product, tenant: string) => {
  let slug = await generateBaseSlug(product)

  const count = await getProductCountBySlug(slug, tenant)

  if (count > 0) {
    slug += `-${count + 1}`
  }

  return slug
}