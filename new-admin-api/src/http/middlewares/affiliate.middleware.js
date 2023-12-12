const { IAffiliateEntities, IAffiliateActions } = require('@mypharma/api-core')
const { Mongo: { Models: { StoreSchema } } } = require('myp-admin/database')

/**
 *
 * @param {IAffiliateEntities} entity
 * @param {IAffiliateActions} action
 */
function affiliateCheck(entity, action) {
  const tenants = new Map([])
  const affiliate_ids = []

  /**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
  const validate = async (req, res, next) => {
    const Store = StoreSchema.Model()

    req.affiliate_scope.forEach(affiliate => {
      const entityPermitted = affiliate.entity.indexOf(entity) !== -1
      const actionPermitted = affiliate.action.indexOf(action) !== -1

      if (entityPermitted && actionPermitted) {

        affiliate_ids.push(affiliate._id)
      }
    })

    if (affiliate_ids.length > 0) {
      const stores = await Store.find({ _id: { $in: affiliate_ids } }).select('tenant')

      stores.forEach(store => {
        if (!tenants.has(store.tenant)) {
          tenants.set(store.tenant, store.tenant)
        }
      })
    }

    req.tenants = []
    req.action = action
    req.entity = entity

    if (tenants.size > 0) req.tenants = Array.from(tenants.values())

    next()
  }

  return validate
}


module.exports = { affiliateCheck }
