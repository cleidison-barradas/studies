import {
  ORM,
  Cart,
  RemarketingRepository
} from "@mypharma/api-core"
import { INTERVALS } from "./PurchaseHelpers"
import { getStoreContent } from "./GetStoreContent"
import { getMissYouContent } from "./GetMissYouContent"
import { getRecentCartProducts } from "./GetRecenteCartProducts"

import { RemarketingType } from "../../../interfaces/remarketing_types"

import RemarketingNotifiedService from '../services/RemarketingNotifiedService'
import CartGetByStoreIdService from "../../cart/services/CartGetByStoreIdService"
import GetMarketingAutomationService from "../services/GetMarketingAutomationService"
import StoreGetByStoreIdService from '../../store/services/StoreGetByStoreIdService'
import CustomerGetByCustomerIdService from '../../customer/services/CustomerGetByCustomerIdService'

const cartGetByStoreIdService = new CartGetByStoreIdService()
const storeGetByStoreIdService = new StoreGetByStoreIdService()
const remarketingNotifiedService = new RemarketingNotifiedService()
const customerGetByCustomerIdService = new CustomerGetByCustomerIdService()
const getMarketingAutomationService = new GetMarketingAutomationService()

interface CreateRemarketingDTO {
  carts: Cart[]
  interval: number
  storeIds: Set<string>
  type: RemarketingType
}

export async function CreateRemarketing({ type, carts, storeIds, interval }: CreateRemarketingDTO) {
  const bulkWriteTask: any[] = []

  for await (const storeId of storeIds) {
    try {

      const filtred = cartGetByStoreIdService.getCartsByStoreId({ storeId, carts })

      const store = await storeGetByStoreIdService.getStoreByStoreId({ storeId })

      const tenant = store.tenant

      await ORM.setup(null, tenant)

      const settings = await getMarketingAutomationService.getMarketingAutomationSettings({ tenant })

      const { MISS_YOU = [], RECENT_CART = false } = settings

      for await (const cart of filtred) {
        try {
          const { products, customerId } = cart

          const customer = await customerGetByCustomerIdService.getCustomerByCustomerId({ tenant, customerId })
          // Check if customer was notified in interval current
          const notified = await remarketingNotifiedService.getHasNotified({ type, interval, customerId })

          if (customer && !notified) {

            const hasInterval = MISS_YOU.length > 0 && MISS_YOU.filter(_interval => _interval.interval === interval && _interval.active === true).length > 0 || false
            const storeContent = getStoreContent(store, customer)

            if (type === 'MISS-YOU' && hasInterval) {
              const content = INTERVALS.find(_interval => _interval.days === interval)

              const dynamicContent = getMissYouContent(customer, store, content)

              bulkWriteTask.push({
                insertOne: {
                  document: {
                    type,
                    customer,
                    interval,
                    channel: "EMAIL",
                    status: 'PENDING',
                    products: [],
                    dynamicContent: dynamicContent,
                    store: storeContent,
                    sendAt: new Date(),
                    createdAt: new Date(),
                  },
                },
              })
            }

            if (type === 'RECENT-CART' && RECENT_CART) {

              bulkWriteTask.push({
                insertOne: {
                  document: {
                    type,
                    customer,
                    interval,
                    channel: "EMAIL",
                    status: 'PENDING',
                    products: getRecentCartProducts(products),
                    store: storeContent,
                    sendAt: new Date(),
                    createdAt: new Date(),
                  },
                },
              })
            }
          }
        } catch (error) {
          console.log(error, `process failure on cart: ${cart._id.toString()}`)
        }
      }

      if (bulkWriteTask.length > 0) {

        await RemarketingRepository.repo().bulkWrite(bulkWriteTask)
      }

      return bulkWriteTask.length

    } catch (error) {
      console.log(error, `process failure on storeId: ${storeId}`)
      return 0
    }
  }
}
