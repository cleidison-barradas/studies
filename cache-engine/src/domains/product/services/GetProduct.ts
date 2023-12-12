import { ProductRepository } from "@mypharma/api-core"

export function getProduct(tenant: string, eans?: string[]) {
  let where: Record<string, any> = {}

  if (eans) {
    where['EAN'] = { $in: eans }
  }

  return ProductRepository.repo(tenant).find(where)
}