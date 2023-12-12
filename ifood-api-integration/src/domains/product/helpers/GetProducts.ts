import { ProductRepository } from "@mypharma/api-core"

export async function getProducts(tenant: string, eans: string[] = []) {
  const where: Record<string, any> = {
    control: null
  }

  if (eans.length > 0) {
    where['EAN'] = { $nin: eans }
  }

  return ProductRepository.repo(tenant).find({
    where,
    select: [
      '_id',
      'EAN',
      'name',
      'price',
      'status',
      'erp_pmc',
      'quantity',
      'specials',
      'pmcPrice',
      'manualPMC',
      'pmcValues',
      'presentation'
    ]
  })
}