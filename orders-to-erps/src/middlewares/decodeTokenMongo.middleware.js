const { validate } = require("uuid")
const { jwtVerify } = require('../jwt')
const { ORM, IntegrationUserErpRepository } = require('@mypharma/api-core')
const { ObjectId } = require("bson")

module.exports = async (req, res, next) => {

  try {
    await ORM.setup()
    const { store_token, products = [] } = req.body

    if (!store_token) {
      return res.status(403).json({
        error: 'store_not_informed'
      })
    }

    if (!validate(store_token)) {
      return res.status(403).json({
        error: 'invalid_token'
      })
    }

    const auth = req.headers.authorization

    if (!auth) {
      return res.status(403).json({
        error: 'missing_authorization'
      })
    }

    const token = auth.replace('Bearer ', '')

    if (!token) {
      return res.status(404).json({
        error: 'invalid_token'
      });
    }

    const payload = await jwtVerify(token)
    const { customer_id } = payload

    const user = await IntegrationUserErpRepository.repo().findById(customer_id)

    if (!user) {
      return res.status(404).json({
        error: 'user_not_found'
      })
    }

    if (req.url.includes('/products') && products.length > 0) {
      await IntegrationUserErpRepository.repo().updateOne({ _id: new ObjectId(user._id.toString()) }, { $set: { lastSeen: new Date() } })
    }

    const store = user.store.find(s => s.token === store_token)

    if (!store) {
      return res.status(404).json({
        error: 'store_not_integrated'
      })
    }

    req.user = user
    req.store_id = store._id
    req.tenant = store.tenant
    req.redisKey = `erp_products_${store._id}`

    next()

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
}

