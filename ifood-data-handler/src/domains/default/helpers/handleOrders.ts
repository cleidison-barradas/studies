import { colors, logger } from "@mypharma/api-core"
import { ObjectId } from "bson"
import { parserOrder } from "./ParserOrder"
import isDev from "../../../utils/isDevelopment"
import { getIfoodOrder } from "../services/order.ifood.store.service"
import { bulkIfoodOrders, bulkStoreOrders, getStoreOrder } from "../services/store.order.service"
import { getOrderDetail, getOrders, setHeader, verifyOrder } from "../../ifood/services/ifood.service"
import { filter } from "./filterOrders"

export const handleOrders = async (tenant: string, storeId: number, accessToken: string) => {
  try {
    setHeader({ Authorization: `Bearer ${accessToken}` })
    const bulkWriteIfoodOrders: any[] = []
    const bulkWriteStoreOrders: any[] = []

    const response = await getOrders(storeId)
    const orders = filter(response.data, storeId)

    if (orders.size > 0) {
      for await (const [ifoodCode, order] of orders) {
        const ifoodOrder = await getIfoodOrder(tenant, ifoodCode)

        if (!ifoodOrder) {

          bulkWriteIfoodOrders.push({
            insertOne: {
              'document': {
                ifoodCode,
                ifoodId: order.id,
                status: order.status,
                createdAt: new Date(),
              }
            }
          })

          const { data: orderDetail } = await getOrderDetail(ifoodCode)
          const orderExists = await getStoreOrder(tenant, order.id)

          if (orderDetail && orderExists === 0) {
            const newOrder = await parserOrder(tenant, orderDetail, order.id)

            bulkWriteStoreOrders.push({
              insertOne: {
                'document': {
                  ...newOrder
                }
              }
            })

            if (!isDev()) await verifyOrder(order.id)
          }

        } else {

          if (order.status !== ifoodOrder.status) {
            bulkWriteIfoodOrders.push({
              updateOne: {
                filter: {
                  _id: new ObjectId(ifoodOrder._id.toString())
                },
                update: {
                  '$set': {
                    status: ifoodOrder.status,
                    updatedAt: new Date()
                  }
                },
                upsert: true
              }
            })
          }
        }
      }

      if (bulkWriteIfoodOrders.length > 0) await bulkIfoodOrders(tenant, bulkWriteIfoodOrders)

      if (bulkWriteStoreOrders.length > 0) await bulkStoreOrders(tenant, bulkWriteStoreOrders)

      logger(`Finished process ${orders.size} orders on ${tenant}`, colors.FgYellow)
    }

  } catch (error) {
    console.log(error)
    throw new Error('error_on_processing_orders')
  }
}