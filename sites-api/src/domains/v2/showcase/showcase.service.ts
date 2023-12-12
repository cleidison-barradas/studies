import { ProductRepository, RedisPlugin, ShowcaseRepository, Store } from '@mypharma/api-core'
import { pmc } from '../../../services/pmc'
import { ObjectID, ObjectId } from 'bson'

export function getShowcases(tenant: string) {
  return ShowcaseRepository.repo<ShowcaseRepository>(tenant).find()
}

export function getMainShowcase(tenant: string) {
  return ShowcaseRepository.repo<ShowcaseRepository>(tenant).findOne({
    where: {
      main: true,
    },
  })
}

export async function getAvailableShowcases(tenant: string, store: Store) {
  const cached = await RedisPlugin.get(`showcase:${store._id}`)
  if (cached) {
    return cached
  }

  const showcases = (
    await ShowcaseRepository.repo(tenant).find({
      where: {
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
  )

  for await (const showcase of showcases) {
    let pAmount = 0
    for await (const p of showcase.products) {
      const realProduct = await ProductRepository.repo(tenant).findOne(
        {
          where:
          {
            _id: new ObjectID(String(p.product._id))
          }
        })

      if (realProduct && realProduct.status && realProduct.quantity > 0) {
        p.product = pmc(realProduct, store)
      } else {
        showcase.products.splice(pAmount, 1)
      }
      pAmount++
    }
  }

  RedisPlugin.setWithExpire(`showcase:${store._id}`, showcases, 60 * 10)

  return showcases
}
