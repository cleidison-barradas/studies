import {
  IntegrationErpRepository,
  IntegrationLog,
  IntegrationLogRepository,
  IntegrationSessionRepository,
  IntegrationUserErpRepository,
  ORM,
  ProductRepository,
  Store,
  StoreRepository,
} from '@mypharma/api-core'
import { integration } from '../config/database'
import moment from 'moment'
import { ObjectId } from 'bson'

function GetStores() {
  return StoreRepository.repo().find({})
}

function GetProducts(tenant: string) {
  return ProductRepository.repo(tenant).find({
    where: {
      lastStock: { $exists: true },
    },
    take: 1,
    order: { lastStock: -1 },
  })
}

async function GetIntegrationType(tenant: string, store: Store) {
  let origin = 'não_integrado'
  let erpName = 'não_integrado'

  const session = await IntegrationSessionRepository.repo(tenant).findOne({
    where: {
      $or: [{ 'user.storeOriginalId': store.originalId || 0 }, { 'user.store._id': new ObjectId(store._id.toString()) }],
      deletedAt: null,
    },
    order: { lastSeen: -1 },
  })

  if (session && session.user) {
    const { user } = session

    const erp = await IntegrationErpRepository.repo(tenant).findOne({
      where: {
        _id: new ObjectId(user.erpVersion.erpId),
      },
    })

    if (erp) {
      erpName = erp.name
      origin = 'etl_core'
    }
  }

  const userErpIntegration = await IntegrationUserErpRepository.repo().findOne({
    where: {
      $or: [{ 'store._id': store._id.toString() }, { 'store._id': new ObjectId(store._id.toString()) }],
      store: { $size: 1 },
      erpId: { $size: 1 },
    },
  })

  if (userErpIntegration) {
    const { erpId } = userErpIntegration

    const erp = await IntegrationErpRepository.repo(tenant).findOne({
      where: {
        _id: new ObjectId(erpId.pop().toString()),
      },
    })

    if (erp) {
      erpName = erp.name
      origin = 'erp_api'
    }
  }

  return { erpName, origin }
}

export const integrationLogService = async () => {
  const stores = await GetStores()
  const bulkWriteLogs: any[] = []
  await ORM.setup(null, integration)
  let lastStock = moment().subtract(30, 'days').toDate()

  for await (const store of stores) {
    const existLog = await IntegrationLogRepository.repo(integration).findOne({ tenant: store.tenant })

    if (!existLog) {
      await ORM.setup(null, store.tenant)
      const newLog = new IntegrationLog()

      const products = await GetProducts(store.tenant)

      if (products.length > 0) {
        lastStock = moment(products[0].lastStock).toDate()
      }

      const { erpName, origin } = await GetIntegrationType(integration, store)

      newLog.received = 0
      newLog.erpName = erpName
      newLog.storeUrl = store.url
      newLog.storeName = store.name
      newLog.lastSeen = lastStock
      newLog.tenant = store.tenant
      newLog.createdAt = new Date()
      newLog.extras = { origin }

      bulkWriteLogs.push({
        insertOne: { ...newLog },
      })
    }
  }

  if (bulkWriteLogs.length > 0) {
    await IntegrationLogRepository.repo(integration).bulkWrite(bulkWriteLogs)
  }
}
