import { colors, logger, ORM } from '@mypharma/api-core'
import { v4 as uuidV4 } from 'uuid'

import { IQueueDataInvalidate } from "../../../support/helpers/WorkerQueue"
import { QueuePlugin } from '../../../support/plugins/queue'
import { groupData } from '../helpers/group'
import { reindexProduct, reindexSuggestions } from '../helpers/reindex'
import { ISendBackQueue } from "../interfaces/sandBackQueue"

const PRODUCT_LIMIT: number = 1000
let sendBackData: ISendBackQueue[] = []

async function sendBackQueue() {

  if (sendBackData.length > 0) {
    for await (const sent of sendBackData) {
      await QueuePlugin.publish('mongo-invalidate-product', sent.data)

      sendBackData = sendBackData.filter(x => x.uuid !== sent.uuid)
    }

    setTimeout(async () => {
      await sendBackQueue()

    }, 10000)
  }
}

export const productService = async () => {
  QueuePlugin.on('mongo-invalidate-product', async ({ data, msg }: any) => {
    try {
      const invalidate = data.content as IQueueDataInvalidate[]

      if (invalidate.length <= 0) {
        await QueuePlugin.ack('mongo-invalidate-product', msg)

        return
      }

      const grouping = groupData(invalidate)

      if (!grouping) {
        await QueuePlugin.ack('mongo-invalidate-product', msg)

        return
      }

      const { eans, tenants } = grouping
      const tenant = tenants[0]
      await ORM.setup(null, tenant)

      let totalProccessed = 0
      const totalReceived = eans.length

      logger(`Start reindex ${totalReceived} products on ${tenant}`, colors.FgYellow)

      do {
        const indexing = eans.splice(0, PRODUCT_LIMIT)

        totalProccessed += await reindexProduct(tenant, indexing)

      } while (eans.length > 0)

      logger(`reindexed ${totalProccessed} products of ${totalReceived} on ${tenant}`, colors.FgGreen)

      await QueuePlugin.ack('mongo-invalidate-product', msg)
      totalProccessed = 0

    } catch (error) {
      console.log(error)
      await QueuePlugin.ack('mongo-invalidate-product', msg)

      sendBackData.push({
        uuid: uuidV4(),
        data: data.content
      })
    }
  })

  await sendBackQueue()
  await QueuePlugin.consume('mongo-invalidate-product')
}

export const suggestService = async () => {
  QueuePlugin.on('mongo-invalidate-suggest-product', async ({ data, msg }: any) => {
    try {
      const invalidate = data.content as IQueueDataInvalidate[]

      if (invalidate.length <= 0) {
        await QueuePlugin.ack('mongo-invalidate-suggest-product', msg)

        return
      }

      const grouping = groupData(invalidate)

      if (!grouping) {
        await QueuePlugin.ack('mongo-invalidate-suggest-product', msg)

        return
      }

      const { eans, tenants } = grouping
      const tenant = tenants[0]
      await ORM.setup(null, tenant)

      let totalProccessed = 0
      const totalReceived = eans.length

      logger(`Start reindex ${totalReceived} suggests on ${tenant}`, colors.FgYellow)

      do {
        const indexing = eans.splice(0, PRODUCT_LIMIT)

        totalProccessed += await reindexSuggestions(tenant, indexing)

      } while (eans.length > 0)

      logger(`reindexed ${totalProccessed} suggests of ${totalReceived} on ${tenant}`, colors.FgGreen)

      await QueuePlugin.ack('mongo-invalidate-suggest-product', msg)
      totalProccessed = 0

    } catch (error) {
      console.log(error)
      await QueuePlugin.ack('mongo-invalidate-suggest-product', msg)

      sendBackData.push({
        uuid: uuidV4(),
        data: data.content
      })
    }
  })

  await sendBackQueue()
  await QueuePlugin.consume('mongo-invalidate-suggest-product')
}