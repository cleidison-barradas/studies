import { OrderRepository, ORM, ProductRepository, RelatedProductsCacheRepository, SearchRepository, StoreRepository } from '@mypharma/api-core'
import { ObjectId } from 'bson'
import { addDays, isAfter } from 'date-fns'

export const getProductBySlug = (tenant: string, slug: string) => {
  return ProductRepository.repo<ProductRepository>(tenant).findOne({
    slug,
  } as any)
}

export const getProductInElastic = (tenant: string, slug: string) => {
  return ProductRepository.repo<ProductRepository>(tenant).findOne({
    slug,
  } as any)
}

export const getProductsByIds = (tenant: string, productsCartId: string[]) => {
  const ids = productsCartId.map((id) => new ObjectId(id))

  return ProductRepository.repo<ProductRepository>(tenant).find({
    where: {
      _id: { $in: ids },
    },
  })
}

export const getProducts = (tenant: string, query: string[] | any[]) => {
  return ProductRepository.repo<ProductRepository>(tenant).find({
    where: {
      _id: {
        $in: query.map((value) => new ObjectId(value)),
      },
    },
  })
}

export function GetStorePMC(storeId: string) {
  return StoreRepository.repo<StoreRepository>().findById(storeId)
}

async function generateRelatedProducts(ean: string) {
  await ORM.setup(null, 'Watcher')

  const relatedProductsCache = await RelatedProductsCacheRepository.repo('Watcher').findOne({
    where: {
      ean: ean,
    },
  })

  const searches = await SearchRepository.repo('Watcher')
    .aggregate([
      {
        $match: {
          $or: [{ 'result.topScorer.ean': Number(ean) }, { 'result.stars.ean': Number(ean) }, { 'result.attractions.ean': Number(ean) }, { 'result.superstars.ean': Number(ean) }],
        },
      },
      {
        $unwind: {
          path: '$result',
        },
      },
      {
        $limit: 20,
      },
    ])
    .toArray()

  const eans = searches.map((value) => String(value.result.topScorer.ean))

  if (relatedProductsCache) {
    await RelatedProductsCacheRepository.repo('Watcher').updateOne(
      {
        ean: ean,
      },
      {
        $set: {
          relatedProducts: eans,
          updatedAt: new Date(),
        },
      }
    )
  } else {
    await RelatedProductsCacheRepository.repo('Watcher').insertOne({
      ean: ean,
      relatedProducts: eans,
      updatedAt: new Date(),
      createdAt: new Date(),
    })
  }
  return eans
}

export async function getRelatedPoductsService(tenant: string, ean: string) {
  await ORM.setup(null, 'Watcher')

  const relatedProductsCache = await RelatedProductsCacheRepository.repo('Watcher').findOne({
    where: {
      ean: ean,
    },
  })

  let relatedProducts = relatedProductsCache ? relatedProductsCache.relatedProducts : null
  const updatedAt = relatedProductsCache ? relatedProductsCache.updatedAt : null

  if (!relatedProducts || !updatedAt || isAfter(new Date(), addDays(new Date(updatedAt), 30))) relatedProducts = await generateRelatedProducts(ean)

  return ProductRepository.repo<ProductRepository>(tenant).find({
    where: {
      quantity: {
        $gt: 1,
      },
      status: true,
      'image.key': {
        $ne: ['', undefined],
      },
      control: null,
      EAN: {
        $in: relatedProducts.map((value) => String(value)),
        $ne: ean,
      },
    },
    take: 10,
  })
}

export function GetMostPurchased(tenant: string) {
  return OrderRepository.repo(tenant)
    .aggregate([
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.product.EAN',
          value: { $addToSet: '$_id' },
          total: { $sum: 1 },
        },
      },
      { $match: { total: { $gt: 1 } } },
    ])
    .toArray()
}

export function GetProductByEan(tenant: string, eans: string[], limit = 20) {
  return ProductRepository.repo(tenant).find({
    where: {
      EAN: { $in: eans },
      status: true,
      control: null,
      image: { $ne: null },
      quantity: { $gt: 0 },
    },
    take: limit,
  })
}
