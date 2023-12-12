import { ORM } from "@mypharma/api-core"
import { MainQueuePlugin } from "../../../support/plugins/queue"
import { handleOrders } from "../helpers/handleOrders"

export const orderService = async () => {
  MainQueuePlugin.on('ifood_sync_order', async ({ data, msg }: any) => {
    try {
      const { content } = data
      if (!content.tenant) {

        return await MainQueuePlugin.ack('ifood_sync_order', msg)
      }

      const { tenant, clientStoreId, accessToken } = content;
      await ORM.setup(null, tenant)

      await handleOrders(tenant, Number(clientStoreId), accessToken)

      await ORM.closeConnection(tenant)

      await MainQueuePlugin.ack('ifood_sync_order', msg)

    } catch (error) {
      console.log(error)
      await MainQueuePlugin.ack('ifood_sync_order', msg)
    }
  })
  await MainQueuePlugin.consume('ifood_sync_order')
}
