import { ISendBackQueue } from "../../../interfaces/sendback"
import { QueuePlugin } from "../../../support/plugins/queue"
import { getUniqueEans } from "../helpers/GetUniqueEans"
import { getUniqueTenants } from "../helpers/GetUniqueTenants"
import { handleEntries } from "../helpers/ParseEntries"
import StoreGetAllStoreService from "./StoreGetAllStoreService"
import { v4 } from 'uuid'

const storeGetAllStoreService = new StoreGetAllStoreService()

let sendBackData: ISendBackQueue[] = []


const STORE_LIMIT: number = 10

interface ISyncProductChangeDTO {
  invalidate: string[]
  invalidatedTenants?: string[]
}

const sendBackQueue = async () => {

  for await (const send of sendBackData) {
    const { invalidate, invalidatedTenants } = send

    await QueuePlugin.publish('sync-product-change', { invalidate, invalidatedTenants })

    sendBackData = sendBackData.filter(d => d.uuid !== send.uuid)
  }

  setTimeout(async () => {
    await sendBackQueue()
  }, 10000)
}

export const storeSyncProductChangeService = async () => {
  QueuePlugin.on('sync-product-change', async ({ data, msg }: any) => {

    try {

      let { invalidate = [], invalidatedTenants = [] } = data.content as ISyncProductChangeDTO

      const eans = getUniqueEans(invalidate)

      if (eans.length <= 0) {

        return await QueuePlugin.ack('sync-product-change', msg)
      }

      const allStores = await storeGetAllStoreService.getAllStore({ invalidatedTenants })

      const stores = allStores.slice(0, STORE_LIMIT)

      const tenants = getUniqueTenants(stores)

      const processed = await handleEntries(tenants, eans)

      invalidatedTenants.push(...processed)

      if (allStores.length > STORE_LIMIT) {

        sendBackData.push({
          uuid: v4(),
          invalidate,
          invalidatedTenants
        })

        return await QueuePlugin.ack('sync-product-change', msg)
      }

      invalidate = []
      invalidatedTenants = []

      await QueuePlugin.ack('sync-product-change', msg)

    } catch (error) {
      console.log(error)
      await QueuePlugin.ack('sync-product-change', msg)
    }
  })

  sendBackQueue()

  await QueuePlugin.consume('sync-product-change')
}