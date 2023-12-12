import { v4 as uuidv4 } from 'uuid'

import { ISendBackQueue } from "../../../interfaces/sendBackQueue"

import { WorkerQueue } from "../../../support/helpers/WorkerQueue"
import { MainQueuePlugin } from "../../../support/plugins/queue"
import { getRandomNode } from "../helpers/GetRandomNode"
import queueConfig from "../../../config/queue"

let sendBackData: ISendBackQueue[] = []

const sendBackQueue = async () => {
  const nodes = queueConfig.nodes.filter(n => n !== queueConfig.node[0])

  for await (const send of sendBackData) {
    const { redisKey, node: nodeOrigin, uuid } = send

    const node = getRandomNode(nodes)

    await MainQueuePlugin.publish('ifood-retrieve-products', { redisKey, nodeOrigin }, node)

    sendBackData = sendBackData.filter(d => d.uuid.toString() !== uuid.toString())
  }

  setTimeout(async () => {
    await sendBackQueue()
  }, 10000)
}

export const productService = async (workerQueue: WorkerQueue) => {
  MainQueuePlugin.on('ifood-retrieve-products', async ({ data, msg }: any) => {
    const { node, content } = data

    const added = workerQueue.add(content.redisKey, node, msg, content.nodeOrigin)

    if (!added) {
      await MainQueuePlugin.ack('ifood-retrieve-products', msg)

      sendBackData.push({
        node,
        uuid: uuidv4(),
        redisKey: content.redisKey
      })
    }
  })

  sendBackQueue()
  // Consume products retrieve queue
  await MainQueuePlugin.consume('ifood-retrieve-products')
}