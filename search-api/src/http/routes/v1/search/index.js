const router = require('express').Router()
const { v4: uuid, validate: isUuid } = require('uuid')

// ElasticSearch and AMQP
const { elasticSearch } = require('../../../../services')

// Helpers
const { normalizeSearch } = require('../../../../helpers')

router.post('/', async (req, res) => {
  let { query, fingerprint = null, store, user = null } = req.body

  if (!store || !store.storeId) {
    return res.status(500).json({
      error: 'store_id_not_informed'
    })
  }

  // Create fingerprint
  if (!fingerprint || !isUuid(fingerprint)) {
    fingerprint = uuid()
  }

  if (!query || query.length === 0) {
    return res.json({
      products: []
    })
  }

  if (!(await elasticSearch.exists({ storeId: store.storeId }))) {
    return res.status(404).json({
      error: 'product_unavailable'
    })
  }

  const { body: { hits } } = await elasticSearch.search({
    storeId: store.storeId,
    query: query
  })

  const products = await normalizeSearch(hits, store)

  res.json({
    fingerprint: fingerprint,
    products
  })

  // if (products.length > 0) {
  //   // Send data to watcher
  //   const watcher = {
  //     fingerprint: fingerprint,
  //     store,
  //     user,
  //     products: products.map(product => {
  //       return {
  //         id: Number(product.product_id),
  //         ean: Number(product.ean),
  //         name: `${product.model} ${product.name}`,
  //         price: Number(product.price),
  //         quantity: Number(product.quantity)
  //       }
  //     }),
  //     term: query,
  //     origin: req.headers['origin'] || '',
  //     userAgent: req.headers['user-agent'] || ''
  //   }
  //   amqp.publish('search-capture', watcher)
  // }
})

module.exports = router
