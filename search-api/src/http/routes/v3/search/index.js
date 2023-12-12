const router = require('express').Router()
const { mongoSearch } = require('../../../../helpers')
const { elasticSearch } = require('../../../../services')

router.post('/', async (req, res) => {
  let { query, tenant, store, fingerprint = null, user = null, size = 500 } = req.body

  if (!query || query.length === 0) {
    return res.status(400).json({
      products: []
    })
  }

  if (!(await elasticSearch.exists({ prefix: 'mongo_store', storeId: tenant }))) {
    return res.status(404).json({
      products: []
    })
  }

  const body = await elasticSearch.search({
    prefix: 'mongo_store',
    storeId: tenant,
    query: query,
    size: size
  })

  const hits = body.hits

  const products = await mongoSearch(hits, tenant, store.storeId)

  // // Watcher
  // fingerprint = await watcher.sendData({
  //   fingerprint,
  //   store,
  //   user,
  //   query,
  //   products,
  //   request: req
  // })

  return res.json({
    fingerprint: fingerprint,
    products
  })
})

module.exports = router
