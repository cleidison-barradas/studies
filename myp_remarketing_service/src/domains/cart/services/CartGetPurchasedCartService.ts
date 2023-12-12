import { Cart, CartRepository, IPurchaseType } from "@mypharma/api-core";
import * as moment from 'moment'
import { getIntervalDays } from '../helpers/GetIntervalDays'

interface CartGetPurchasedCartServiceDTO {
  purchased: IPurchaseType
}

class CartGetPurchasedCartService {
  constructor(private respository?: any) { }

  public async getPurchasedCarts({ purchased = 'YES' }: CartGetPurchasedCartServiceDTO) {
    const intervals = getIntervalDays()
    const purchases = new Map<number, Cart[]>([]);

    for await (const interval of intervals) {
      const now = moment().subtract(interval.days, "days")

      const results = await CartRepository.repo().find({
        where: {
          purchased,
          customerId: { $ne: null },
          updatedAt: {
            $gte: now.startOf("day").toDate(),
            $lte: now.endOf("day").toDate(),
          },
        },
      })

      if (results.length > 0) {
        let cartPurchases = purchases.get(interval.days) || []

        cartPurchases.push(...results)

        purchases.delete(interval.days)

        purchases.set(interval.days, cartPurchases)

        cartPurchases = []
      }
    }

    return purchases

  }
}

export default CartGetPurchasedCartService