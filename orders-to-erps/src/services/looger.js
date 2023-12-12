const { IntegrationUserErp, ORM, IntegrationErpRepository } = require("@mypharma/api-core")
const { IntegrationLogRepository } = require("@mypharma/api-core")
const { ObjectId } = require("bson")
const { DATABASE_INTEGRATION } = process.env

/**
 * @param {string} tenant 
 * @param {number} total 
 * @param {IntegrationUserErp} user 
 */
const CreateLog = async (tenant, total, user) => {
  await ORM.setup(null, DATABASE_INTEGRATION)

  const exists = await IntegrationLogRepository.repo(DATABASE_INTEGRATION).findOne({ tenant })

  const erpId = new ObjectId(user.erpId.pop())

  const erp = await IntegrationErpRepository.repo(DATABASE_INTEGRATION).findById(erpId)

  if (!erp) {
    throw new Error('erp_not_found')
  }

  const store = user.store.find(s => s.tenant.toString() === tenant)

  if (!store) {
    throw new Error('store_not_found')
  }

  if (!exists) {
    return IntegrationLogRepository.repo(DATABASE_INTEGRATION).createDoc({
      tenant,
      received: total,
      erpName: erp.name,
      storeUrl: store.url,
      storeName: store.name,
      createdAt: new Date(),
      lastSeen: new Date(),
      extras: {
        origin: 'erp_api'
      }
    })
  }

  await IntegrationLogRepository.repo(DATABASE_INTEGRATION).updateOne(
    { tenant },
    {
      $set: {
        received: total,
        erpName: erp.name,
        lastSeen: new Date(),
        updatedAt: new Date(),
        extras: {
          origin: 'erp_api'
        }
      }
    }
  )
}

module.exports = { CreateLog }