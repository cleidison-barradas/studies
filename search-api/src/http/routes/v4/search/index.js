const router = require('express').Router()
const { elasticSearch } = require('../../../../services')
const { mongoDefault } = require('../../../../helpers')

router.post('/', async (req, res) => {
  let { query, tenant, store, size = 500 } = req.body

  const default_index = req.get('x-index-origin') || ''

  if (!query || query.length === 0) {
    return res.json({
      products: []
    })
  }

  if (!(await elasticSearch.exists({ prefix: 'mongo_store', storeId: tenant }))) {
    return res.status(404).json({
      products: []
    })
  }

  const response = await elasticSearch.search({
    prefix: 'mongo_store',
    storeId: tenant,
    default_index,
    query: query,
    size: size
  })

  const hits = response.hits

  const products = await mongoDefault(hits, tenant, store.storeId)

  return res.json({
    products
  })
})

module.exports = router