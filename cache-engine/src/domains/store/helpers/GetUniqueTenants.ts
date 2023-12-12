import { Store } from "@mypharma/api-core";

export const getUniqueTenants = (stores: Store[]) => {
  if (stores.length <= 0) return []
  const tenants = stores.map(store => store.tenant)

  const unified = new Set(tenants)

  const uniqueEans = Array.from(unified.values())

  unified.clear()

  return uniqueEans
}