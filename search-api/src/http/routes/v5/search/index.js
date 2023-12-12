const router = require('express').Router()
const { mongoSearchNoValidation } = require('../../../../helpers')
const elasticSearch = require('../../../../services/elasticsearch')

router.post('/', async (req, res) => {
  try {
    let { query, tenant, store, fingerprint = null, size = 500 } = req.body

    if (!query || query.length === 0) {

      throw new Error('query_empty')
    }

    if (!(await elasticSearch.exists({ prefix: 'mongo_store', storeId: tenant }))) {

      throw new Error('elastic_index_not_found')
    }

    const response = await elasticSearch.semanticSearch({
      prefix: 'mongo_store',
      storeId: tenant,
      text: query,
      size: size
    })

    const hits = response.hits

    const products = await mongoSearchNoValidation(hits, tenant, store.storeId)

    fingerprint = await elasticSearch.searchHistory({ query, tenant, fingerprint })

    return res.json({
      products,
      fingerprint
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      products: []
    })
  }
})
router.post('/autocompletion', async (req, res) => {
  try {
    const { query, storeId = process.env.NODE_ENV } = req.body

    if (!query || query.length === 0) {

      throw new Error('query_empty')
    }

    if (!(await elasticSearch.exists({ prefix: 'mongo_store_suggest', storeId }))) {

      throw new Error('elastic_index_not_found')
    }

    const response = await elasticSearch.suggestion({
      storeId,
      text: query
    })

    const medicine_suggestions = response.suggest['medicine_suggestions'] || []

    const suggestions = medicine_suggestions[0]['options'] || []

    return res.json({
      suggestions
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      suggestions: []
    })
  }
})


router.get('/past-searches', async (req, res) => {
  try {

    const fingerprint = req.get('x-search-id') || null
    const user_id = req.get('x-search-user-id') || null
    const tenant = req.get('x-search-tenant-id') || null

    const response = await elasticSearch.pastSearches({ fingerprint, user_id, tenant })

    const past_searches = response.hits.hits || []

    return res.json({
      past_searches
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      past_searches: []
    })
  }
})


module.exports = router