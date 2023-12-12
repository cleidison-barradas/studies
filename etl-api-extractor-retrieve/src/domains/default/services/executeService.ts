import { colors, logger, ORM } from '@mypharma/api-core'
import { QueuePlugin } from '../../../support/plugins/queue'
import { IProductResponse } from '../../../interfaces/IProductResponse'
import { IProcess } from '../../parsers/interfaces'

import UserUpdateService from '../../user/services/UserUpdateService'
import { ProcessProductService } from '../../products/services/ParserProducts'
import { integration } from '../../../config/database'
import Redis from '../../../support/redis/Redis'
import { GetUsers } from '../helpers/GetUsers'
import GetErps from '../helpers/GetErps'
import { isDev } from '../../../utils'
import parsers from '../../parsers'

import * as moment from 'moment'

const retrieveProcess = async () => {
  await ORM.setup(undefined, integration)
  const storeProcess: IProcess[] = []

  const supportedErps = await GetErps(integration)
  const users = await GetUsers()

  users.forEach(user => {
    const { erpId, token, store, _id, erpUser, baseUrl } = user
    const erp = supportedErps.find(support => erpId.filter(x => x.toString() === support._id.toString()).length > 0)
    if (erp) {
      const parser = parsers.find(p => {
        return p.key().trim().toLowerCase() === erp.name.trim().toLowerCase()
      })

      if (parser) {
        storeProcess.push({
          token,
          erpUser,
          userId: _id.toString(),
          handle: parser.handle,
          tenant: store[0].tenant,
          baseUrl
        })
      }
    }
  })
  return storeProcess
}

const sendProcess = async (key: string, tenant: string, userId: string, delta: IProductResponse[]) => {
  const redisConnection: any = {}
  const userService = new UserUpdateService()

  redisConnection['userId'] = userId
  redisConnection['tenant'] = tenant
  redisConnection['products'] = delta

  await Redis.set(key, redisConnection)
  const expiresIn = moment().add(1, 'hours').unix()
  await Redis.expireAt(key, expiresIn)

  await userService.execute({ userId, lastSeen: new Date() })

  await QueuePlugin.publish('etl-api-extractor-products', key)
}

export const executeProcess = async () => {
  let process = await retrieveProcess()

  for await (const task of process) {
    try {
      const { tenant, handle, token, userId, erpUser, baseUrl } = task
      const redisKey = `extractor_api_products_${tenant}`
      let delta: IProductResponse[] = []

      await ORM.setup(undefined, tenant)

      logger(`request products from ${tenant}`, colors.FgGreen)

      const products = await handle(token, tenant, erpUser, baseUrl)

      if (products.length > 0) {

        do {
          const processing = products.splice(0, 1000)

          const processed = await ProcessProductService(processing, tenant)

          delta.push(...processed)

        } while (products.length > 0)


        if (delta.length > 0) {
          await sendProcess(redisKey, tenant, userId, delta)

          logger(`sending ${delta.length} products to ${tenant}`, colors.FgGreen)

          delta = []
        }
      }

    } catch (error) {
      console.log(error)
    }
  }

  process = []

  setTimeout(async () => {
    return await executeProcess()
  }, 6000)
}
