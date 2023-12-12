import { ProductRepository, StoreRepository } from '@mypharma/api-core'

export const getProductBySlug = (tenant: string, slug: string) => {
  return ProductRepository.repo<ProductRepository>(tenant).findOne({
    where: {
      slug,
    },
  })
}

export function GetStorePMC(storeId: string) {
  return StoreRepository.repo<StoreRepository>().findById(storeId)
}

export function getProductsByEAN(tenant: string, eans: string[], minQuantity?: number, controled?: boolean) {
  const query = { where: { EAN: { $in: eans } } }

  if (controled === false) {
    query['where']['control'] = null
  }

  if (minQuantity) {
    query['where']['quantity'] = { $gte: minQuantity }
  }

  return ProductRepository.repo(tenant).find(query)
}
