import { ProductRepository } from '@mypharma/api-core'

export function GetStoreReplicas(eans: string[], tenant: string) {

  return ProductRepository.repo(tenant).find({
    where: {
      EAN: { $in: eans }
    },
    select: ['EAN', 'name', 'erp_pmc', 'price', 'quantity', 'lastStock']
  })
}
