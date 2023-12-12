import * as moment from "moment"
import { Cart, CartRepository } from "@mypharma/api-core"
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

export async function GetRecentCart() {
  const carts = new Map<number, Cart[]>([])

  for await (const item of intervals) {
    const now = moment().subtract(item.interval, "minutes")

    const result = await CartRepository.repo().find({
      where: {
        purchased: "NO",
        customerId: { $ne: null },
        products: { $gt: [{ $size: 0 }] },
        updatedAt: {
          $gte: now.clone().subtract(item.offset, "minutes").toDate(),
          $lte: now.clone().add(item.offset, "minutes").toDate(),
        }
      }
    })

    if (result.length > 0) {
      carts.set(item.interval, result)
    }
  }
  return carts
}
