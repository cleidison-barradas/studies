import { CreateRemarketing } from "../helpers/CreateRemarketingTask"
import { getCartUniqueStoreIds } from "../helpers/GetCartUniqueStore"
import RemarketingExecuteTaskService from "./RemarketingExecuteTaskService"
import CartGetRecenteUpdatedService from "../../cart/services/CartGetRecenteUpdatedService"

const cartGetRecenteUpdatedService = new CartGetRecenteUpdatedService()
const remarketingExecuteTaskService = new RemarketingExecuteTaskService()

export const RecentCartService = async () => {

  try {
    const cartsUpdated = await cartGetRecenteUpdatedService.getRecentCartUpdated({ purchased: 'NO' })

    if (cartsUpdated.size <= 0) return

    for await (const [interval, carts] of cartsUpdated) {
      const storeIds = getCartUniqueStoreIds(carts)

      await CreateRemarketing({ type: 'RECENT-CART', interval, storeIds, carts })
    }

    await remarketingExecuteTaskService.executeRemarketingTasks({ type: 'RECENT-CART', channel: 'EMAIL', status: 'PENDING' })

  } catch (error) {
    console.log(error)
  }
}