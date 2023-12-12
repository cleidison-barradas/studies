const router = require('express').Router()
const { startupStore } = require('myp-admin/services/jwt')
const { checkTenantMiddleware } = require('myp-admin/http/middlewares')
const { Mongo: { getModelByTenant } } = require('myp-admin/database')

router.use(checkTenantMiddleware)

router.get('/startup', async (req, res) => {
  try {
    const { store } = req
    const { tenant, storeUrls: urls = [] } = store
    const StoreGroup = getModelByTenant(tenant, 'StoreGroupSchema')

    const storeGroup = await StoreGroup.find({})

    const { accessToken, facebookUrl, googleUrl } = await startupStore(store)

    const groups = storeGroup.length > 0 ? storeGroup[0] : []

    return res.json({
      accessToken,
      store: {
        ...store,
        urls,
        groups,
        googleUrl,
        facebookUrl,
      }
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
})

module.exports = router
