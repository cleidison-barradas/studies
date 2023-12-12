import { QueuePlugin } from "../../support/plugins/queue"
import { WorkerQueue } from "../../support/helpers/WorkerQueue"

export const processService = async (workerqueue: WorkerQueue) => {
  await QueuePlugin.on('etl-api-extractor-products', async ({ data, msg }: any) => {
    try {
      const added = workerqueue.add(data.content, msg)

      if (!added) {
        await QueuePlugin.ack('etl-api-extractor-products', msg)
      }

    } catch (error) {
      console.log(error)
      await QueuePlugin.ack('etl-api-extractor-products', msg)
    }
  })
  await QueuePlugin.consume('etl-api-extractor-products')
}
