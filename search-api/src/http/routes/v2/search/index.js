const router = require('express').Router()

// ElasticSearch and AMQP
const { elasticSearch } = require('../../../../services')

// Helpers
const { normalizeMongoSearch, normalizeNeighborhood } = require('../../../../helpers')

router.post('/', async (req, res) => {
  let { query, fingerprint = null, tenant, user = null, store } = req.body

  if (!query || query.length === 0) {
    return res.json({
      products: []
    })
  }

  if (!(await elasticSearch.exists({ prefix: 'mongo_store', storeId: tenant }))) {
    return res.status(404).json({
      error: 'product_unavailable'
    })
  }

  const { body: { hits } } = await elasticSearch.search({
    prefix: 'mongo_store',
    storeId: tenant,
    query: query
  })

  const products = await normalizeMongoSearch(hits, tenant, store)

  // Watcher
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

router.post('/address', async (req, res) => {
  const { query } = req.body
  try {
    if (!query || query.length === 0) {
      return res.json({
        neighborhoods: []
      })
    }

    if (!(await elasticSearch.exists({ prefix: 'mongo', storeId: 'neighborhood' }))) {
      return res.status(404).json({
        error: 'Unavailable Address'
      })
    }

    const { body: { hits } } = await elasticSearch.searchAddress({
      query: query
    })

    const neighborhoods = await normalizeNeighborhood(hits)

    return res.json({ neighborhoods })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

module.exports = router
