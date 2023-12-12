import { CreateRemarketing } from "../helpers/CreateRemarketingTask"
import { getCartUniqueStoreIds } from "../helpers/GetCartUniqueStore"

import CartGetPurchasedCartService from "../../cart/services/CartGetPurchasedCartService"
import RemarketingExecuteTaskService from "./RemarketingExecuteTaskService"

const cartGetPurchasedCartService = new CartGetPurchasedCartService()
const remarketingExecuteTaskService = new RemarketingExecuteTaskService()

export const MissYouService = async () => {
  try {

    const results = await cartGetPurchasedCartService.getPurchasedCarts({ purchased: 'YES' })

    if (results.size <= 0) return

    for await (const [interval, carts] of results) {
      const storeIds = getCartUniqueStoreIds(carts)

      await CreateRemarketing({ type: 'MISS-YOU', interval, carts, storeIds })
    }

    await remarketingExecuteTaskService.executeRemarketingTasks({ type: 'MISS-YOU', channel: 'EMAIL', status: 'PENDING' })

  } catch (error) {
    console.log(error)
  }
}
