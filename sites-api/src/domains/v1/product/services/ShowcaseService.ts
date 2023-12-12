import { ShowcaseRepository, SearchRepository, ORM } from '@mypharma/api-core'
import { ObjectId } from 'mongodb'

export function getShowcases(tenant: string) {
  return ShowcaseRepository.repo<ShowcaseRepository>(tenant).find()
}

export function getMainShowcase(tenant: string) {
  return ShowcaseRepository.repo<ShowcaseRepository>(tenant).findOne({
    where: {
      main: true,
      status: true,
      $or: [
        {
          initialDate: {
            $lte: new Date(),
          },
          finalDate: {
            $gte: new Date(),
          },
        },
        {
          initialDate: undefined,
          finalDate: undefined,
        },
      ],
    },
  })
}

export async function getSmartShowcase(storeId: string) {
  await ORM.setup(null, 'Watcher')

  return SearchRepository.repo('Watcher')
    .aggregate([
      { $match: { 'store.storeId': new ObjectId(storeId) } },
      { $unwind: { path: '$result' } },
      { $unwind: { path: '$result.stars' } },
      { $group: { _id: '$result.stars.ean', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])
    .toArray()
}

export async function updateSmartShowcase(tenant: string, products: any[]) {
  return ShowcaseRepository.repo(tenant).updateOne({ where: { main: true } }, { $set: { products } })
}
