import { ProductRepository } from "@mypharma/api-core";

export function countProducts(tenant: string) {
  return ProductRepository.repo(tenant).count({ control: null })
}