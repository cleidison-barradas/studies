// MomentJS
const { ObjectId } = require('bson')
const moment = require('moment')

const { databases } = require('myp-admin/config')

// Database
const { Mongo: { getModelByTenant, Models: { StoreSchema } } } = require('myp-admin/database')

const MS_DAY = 60000 * 1440

const getIntegrationInfo = async (storeId) => {
  const IntegrationErp = getModelByTenant('integration', 'IntegrationErpSchema')
  const IntegrationSession = getModelByTenant('integration', 'IntegrationSessionSchema')
  const IntegrationErpVersion = getModelByTenant('integration', 'IntegrationErpVersionSchema')
  const IntegrationUserErp = getModelByTenant(databases.mongoConfig.name, 'IntegrationUserErpSchema')

  const store = await StoreSchema.Model().findById(storeId)
  let status = 'healthy'
  let erp = null
  
  if (!store) return null

  const where = {
    $or: [
      { store: { $elemMatch: { _id: { $in: [new ObjectId(storeId), storeId] } } } }
    ]
  }

  if (store.erp) {
    erp = store.erp

    where['$or'] = [
      { store: { $elemMatch: { _id: { $in: [new ObjectId(storeId), storeId] } } } },
      {'erpId': new ObjectId(store.erp._id)}
    ]
  }

  const apiIntegration = await IntegrationUserErp.findOne(where)

  if (apiIntegration) {
    const { email, lastSeen = null, erpId } = apiIntegration

    if (!erp) {
      erp = await IntegrationErp.findById(erpId[0])
    }

    if (lastSeen && moment().diff(moment(lastSeen)) > (MS_DAY / 2)) {
      status = 'warning'
    }
    if (lastSeen && moment().diff(moment(lastSeen)) > MS_DAY) {
      status = 'problem'
    }
    if (!lastSeen) {
      status = 'unknown'
    }

    const hasIntegrated = apiIntegration.store.find(x => x._id.toString() === store._id.toString())
    const mergeableFields = new Set(['name', 'sku', 'erp_pmc', 'presentation', 'activePrinciple'])

    return {
      erp: {
        _id: erp._id,
        name: erp.name,
        hasOrderSupport: true,
        orderSupport: {
          email,
          token: hasIntegrated ? hasIntegrated.token : ''  
        }
      },
      erpVersion: {
        _id: '',
        name: String('integração por api').toUpperCase()
      },
      status,
      lastSeen,
      mergeableFields: Array.from(mergeableFields)
    }
  }

  const session = await IntegrationSession.findOne({
    $or: [
      {
        'user.storeOriginalId': store.originalId || 0
      },
      {
        'user.store._id': storeId
      }
    ],
    deletedAt: null
  }, null, {
    sort: {
      lastSeen: -1
    }
  })

  const user = session && session.user ? session.user : null
  if (!user || !user.erpVersion) {
    return null
  }

  erp = await IntegrationErp.findById(user.erpVersion.erpId)

  // If we did find the erp in the embedded of the version, we should try to find at 
  // the model of version
  if (!erp && user.erpVersion._id) {
    const version = await IntegrationErpVersion.findById(user.erpVersion._id)
    if (version && version.erpId) {
      erp = await IntegrationErp.findById(version.erpId)
    }
  }

  // Get user orders erp integration
  const orderErpSupport = await IntegrationUserErp.findOne({
    'erpId': new ObjectId(erp._id)
  })

  let hasIntegrated = null
  if (orderErpSupport) {
    hasIntegrated = orderErpSupport.store.find(s => s._id.toString() === storeId.toString())
  }

  if (session && moment().diff(moment(session.lastSeen)) > (MS_DAY / 2)) {
    status = 'warning'
  }
  if (session && moment().diff(moment(session.lastSeen)) > MS_DAY) {
    status = 'problem'
  }
  if (!session) {
    status = 'unknown'
  }

  const mergeableFields = new Set(['name'])
  if (user.erpVersion.schema) {
    const schema = user.erpVersion.schema
    Object.keys(schema).forEach(key => {
      if (schema[key].mergeable) {
        mergeableFields.add(key)
      }
    })
  }

  return {
    erp: erp ? {
      _id: erp._id,
      name: erp.name,
      hasOrderSupport: erp.hasOrderSupport || false,
      orderSupport: orderErpSupport ? {
        email: orderErpSupport.email,
        token: hasIntegrated ? hasIntegrated.token : ''
      } : null,

    } : null,
    erpVersion: {
      _id: user.erpVersion._id,
      name: user.erpVersion.name
    },
    lastSeen: session ? session.lastSeen : null,
    mergeableFields: Array.from(mergeableFields),
    status
  }
}

module.exports = {
  getIntegrationInfo
}
