import { Cart, CartRepository, IPurchaseType } from "@mypharma/api-core"
import * as moment from 'moment'
import IntervalTime from "../../../interfaces/interval_time"

const intervals: IntervalTime[] = [
  {
    interval: 15,
    offset: 2,
  },
  {
    interval: 20,
    offset: 2,
  },
  {
    interval: 30,
    offset: 2,
  },
]

interface CartGetRecenteUpdatedServiceDTO {
  purchased: IPurchaseType

}

class CartGetRecenteUpdatedService {
  constructor(private repository?: any) { }

  public async getRecentCartUpdated({ purchased }: CartGetRecenteUpdatedServiceDTO) {
    const carts = new Map<number, Cart[]>([])

    for await (const item of intervals) {
      const now = moment().subtract(item.interval, "minutes")

      const result = await CartRepository.repo().find({
        where: {
          purchased,
          customerId: { $ne: null },
          products: { $gt: [{ $size: 0 }] },
          updatedAt: {
            $gte: now.clone().subtract(item.offset, "minutes").toDate(),
            $lte: now.clone().add(item.offset, "minutes").toDate(),
          }
        }
      })

      if (result.length > 0) {
        let results = carts.get(item.interval) || []

        results.push(...result)

        carts.delete(item.interval)

        carts.set(item.interval, results)

        results = []
      }
    }
    return carts
  }
}

export default CartGetRecenteUpdatedService