import { SocketProductData } from "@mypharma/etl-engine"

export const filterUniqueProducts = (entries: SocketProductData[]) => {
  let uniqueProducts = new Map<string, SocketProductData>([])

  entries.forEach(entry => {
    if (!uniqueProducts.has(entry.ean.toString())) {
      uniqueProducts.set(entry.ean.toString(), entry)
    }
  })

  const products = Array.from(uniqueProducts.values())

  uniqueProducts = null

  return products
}