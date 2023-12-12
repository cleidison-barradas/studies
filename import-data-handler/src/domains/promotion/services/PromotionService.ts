import moment from "moment"
import ProductBulkWriteService from '../../product/service/ProductBulkWriteService'
import ShowCaseBulkWriteService from '../../showCase/services/ShowCaseBulkWriteService'
import ProductGetProductByEanService from '../../product/service/ProductGetProductByEanService'

import { IPromotion, ISpecial } from "../../../interfaces/promotion";
import { InvalidateCache } from "../../../interfaces/invalidate";
import { filterPromotionValid } from "../helpers/filterPromotionValid";

const productBulkWriteService = new ProductBulkWriteService()
const showCaseBulkWriteService = new ShowCaseBulkWriteService()
const productGetProductByEanService = new ProductGetProductByEanService()

export const handlePromotions = async (entries: IPromotion[], tenant: string) => {
  const bulkWriteShowCase = []
  const bulkWritePromotion = []
  const invalidateCache: InvalidateCache[] = []

  for await (const promotion of entries) {
    const { price, date_start = new Date(), date_end = new Date() } = promotion
    const specials: ISpecial[] = []

    try {
      const EAN = promotion.EAN.toString()
      const product = await productGetProductByEanService.getProductByEan({ tenant, EAN: promotion.EAN })

      if (Number(price) < Number(product.price)) {
        specials.push({
          price: Number(price),
          date_start: moment(date_start).startOf('day').toDate(),
          date_end: moment(date_end).endOf('day').toDate()
        })

        bulkWritePromotion.push({
          updateOne: {
            filter: { EAN },
            update: {
              '$set': { specials, updatedAt: new Date() }
            }
          }
        })

        bulkWriteShowCase.push({
          updateMany: {
            filter: {
              products: {
                $elemMatch: {
                  'product.EAN': promotion.EAN.toString()
                }
              }
            },
            update: {
              '$set': {
                'products.$.product.specials': specials,
                'products.$.product.updatedAt': new Date(),
              }
            }
          }
        })

        invalidateCache.push({
          ean: promotion.EAN,
          tenant
        })
      }

    } catch (error) {
      console.log(error)
      console.log(`Error on process ${JSON.stringify(promotion)}`)
    }
  }

  if (bulkWritePromotion.length > 0) {
    const response = await productBulkWriteService.bulkWriteProduct({ tenant, bulkWrite: bulkWritePromotion })

    if (bulkWriteShowCase.length > 0) {
      await showCaseBulkWriteService.bulkWriteShowCase({ tenant, bulkWrite: bulkWriteShowCase })
    }
    const modifiedCount = response.modifiedCount

    console.log(`inserted ${modifiedCount} promotions on ${tenant}`)

    return {
      modifiedCount,
      invalidateCache
    }
  }

  return {
    modifiedCount: 0,
    invalidateCache: []
  }
}

export const promotionService = async (entries: IPromotion[], tenant: string) => {
  try {
    const promotions = filterPromotionValid({ entries })

    const { modifiedCount = 0, invalidateCache = [] } = await handlePromotions(promotions, tenant)

    return {
      modifiedCount,
      invalidateCache
    }

  } catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
}