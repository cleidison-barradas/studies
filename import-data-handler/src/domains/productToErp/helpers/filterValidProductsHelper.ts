import { ProductRepository } from "@mypharma/api-core"
import { IProductToErp } from "../../../interfaces/productToErp"

export async function filterValidProducts(entries: IProductToErp[], tenant: string) {
  const eans = entries.map((e: any) => e.EAN.toString())

  if (eans.length <= 0) return { valids: [], replicas: [] }

  const replicas = await ProductRepository.repo().find({
    where: {
      EAN: { $in: eans }
    },
    select: [
      '_id',
      'EAN',
      'name',
      'slug',
      'image',
      'control',
      'category',
      'manufacturer',
      'classification',
      'activePrinciple',
    ]
  })

  const valids = await ProductRepository.repo(tenant).find({
    where: {
      EAN: { $in: eans }
    },
    select: [
      '_id',
      'EAN',
      'name',
      'price',
      'erp_pmc',
      'quantity',
      'updatedAt',
      'specials',
      'lastStock',
      'updateOrigin',
      'presentation',
      'priceLocked',
      'quantityLocked',
      'activePrinciple',
    ]

  })

  return {
    valids,
    replicas
  }
}