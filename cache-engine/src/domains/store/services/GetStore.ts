import { StoreRepository } from "@mypharma/api-core";

export function getStore(tenant: string) {
  return StoreRepository.repo().findOne({ tenant })
}