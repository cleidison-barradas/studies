import { isMainThread, parentPort, Worker } from 'node:worker_threads'

export const worker = (message: string) => {
  if (isMainThread) {
    const worker = new Worker(__filename)

    worker.once('message', message => {
      console.log(message)
    })

    worker.postMessage(message)

  } else {
    parentPort.once('message', message => {
      parentPort.postMessage(message)
    })
  }
}
