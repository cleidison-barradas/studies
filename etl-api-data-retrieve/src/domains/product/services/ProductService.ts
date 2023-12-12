import { v4 as uuidv4 } from 'uuid'
import { QueuePlugin } from '@mypharma/etl-engine'

import { getRandomNode } from '../helpers/worker/GetRandomNode'
import { ISendBackQueue } from '../../interfaces/sendbackqueue'

import socketConfig from '../../../config/socket'
import { WorkerQueue } from '../../../support/helpers/WorkerQueue'


let sendBackData: ISendBackQueue[] = []

const sendBackQueue = async () => {
  const nodes = socketConfig.nodes.filter(n => n !== socketConfig.node[0])

  for await (const send of sendBackData) {
    const { redisKey, node: nodeOrigin, uuid } = send

    const node = getRandomNode(nodes)

    await QueuePlugin.publish('retrieve-products', { redisKey, nodeOrigin }, node)

    sendBackData = sendBackData.filter(d => d.uuid.toString() !== uuid.toString())
  }

  setTimeout(async () => {
    await sendBackQueue()
  }, 10000)
}

export const productService = async (workerQueue: WorkerQueue) => {
  QueuePlugin.on('retrieve-products', async ({ data, msg }) => {
    const { node, content } = data

    const added = workerQueue.add(content.redisKey, node, msg, content.nodeOrigin)

    if (!added) {
      await QueuePlugin.ack('retrieve-products', msg)

      sendBackData.push({
        node,
        uuid: uuidv4(),
        redisKey: content.redisKey
      })
    }
  })

  sendBackQueue()
  // Consume products retrieve queue
  await QueuePlugin.consume('retrieve-products')
}

