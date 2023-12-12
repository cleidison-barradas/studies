import { ProductRepository } from "@mypharma/api-core";
import { IProduct } from "../../../interfaces/product";

export async function filterValidProducts(entries: IProduct[], tenant: string) {
  const eans = entries.map((e: any) => e.EAN.toString())

  if (eans.length <= 0) return { valids: [], replicas: [] }

  const replicas = await ProductRepository.repo().find({
    where: {
      EAN: { $in: eans }
    },
    select: [
      'EAN',
      'name',
      'image',
      'control',
      'category',
      'description',
      'presentation',
      'manufacturer',
      'classification',
      'activePrinciple'
    ]
  })

  const valids = await ProductRepository.repo(tenant).find({
    where: {
      EAN: { $in: eans }
    },
    select: [
      "_id",
      'EAN',
      'name',
      'slug',
      'price',
      'control',
      'quantity',
      'lastStock',
      'manufacturer',
      'presentation',
      'activePrinciple'
    ]

  })

  return {
    valids,
    replicas
  }
}