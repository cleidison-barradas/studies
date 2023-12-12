import { IProductResponse } from '../../../interfaces/IProductResponse'
import { GetStoreReplicas } from '../helpers/GetStoreReplicas'

const productFilter = (data: IProductResponse[]) => {
  return data.filter(
    (item) =>
      typeof item.EAN !== 'undefined' &&
      Number(item.EAN) > 0 &&
      typeof item.price !== 'undefined' &&
      !isNaN(item.price) &&
      typeof item.quantity !== 'undefined' &&
      !isNaN(item.quantity)
  )
}

const productsDelta = async (data: IProductResponse[], tenant: string) => {
  const eans = data.map(item => item.EAN.toString())
  const deltaProducts = new Map<string, IProductResponse>([])

  const replicas = await GetStoreReplicas(eans, tenant)

  if (replicas.length <= 0) return data

  data.forEach(product => {
    const replica = replicas.find(r => r.EAN.toString() === product.EAN.toString())

    if (!replica) {

      if (!deltaProducts.has(product.EAN)) {

        deltaProducts.set(product.EAN.toString(), product)
      }
    } else {

      if (
        product.name !== replica.name ||
        Number(product.price) !== Number(replica.price) ||
        Number(product.quantity) !== Number(replica.quantity) ||
        Number(product.erp_pmc || 0) !== Number(replica.erp_pmc || 0)
      ) {
        if (!deltaProducts.has(product.EAN)) {
          product.lastStock = replica.lastStock || new Date()

          deltaProducts.set(product.EAN.toString(), product)
        }
      }
    }
  })

  if (deltaProducts.size > 0) {
    const filtred = Array.from(deltaProducts.values())

    return filtred
  }

  return []
}

export const ProcessProductService = async (
  entries: IProductResponse[],
  tenant: string
) => {
  const filtred = productFilter(entries)
  const delta = await productsDelta(filtred, tenant)


  return delta
}
