const { ORM, StoreRepository, Store } = require('@mypharma/api-core')
const grabPatterns = require('./grabPatterns')
const getPmcProduct = require('./getPmcProduct')
/**
 * 
 * @param {object} params 
 * @param {Store} params.store 
 * @param {string} params.tenant 
 * @param {object} params.searchResponse 
 * @param {Array} params.searchResponse.hits
 * 
 * @returns {Promise<Map>}
 */
const retrieve = async ({ searchResponse, tenant, store }) => {
  const result = new Map([])
  await ORM.setup(null, tenant)
  const { hits = [] } = searchResponse

  const products = hits.map(_hit => _hit)

  const activePrinciples = products.filter(_product => _product._source.activePrinciple && _product.activePrinciple.length > 0).map(_product => _product._source.activePrinciple)

  const patterns = await grabPatterns(activePrinciples, tenant)

  products.forEach(product => {
    const { ean, classification, activePrinciple } = product._source

    if (classification && classification.name === 'ETICO' && activePrinciple && activePrinciple.length > 0) {

      let patternsFiltred = patterns.filter(pattern => pattern.EAN !== ean && pattern.activePrinciple === activePrinciple)

      patternsFiltred.forEach(_pattern => {

        if (!result.has(_pattern.EAN)) {
          _pattern = getPmcProduct(_pattern, store)
          _pattern.generic = true
          delete _pattern.status
          delete _pattern.classification

          result.set(_pattern.EAN, {
            ..._pattern
          })
        }
      })

      patternsFiltred = []
    }

    product._source = getPmcProduct(product._source, store)

    product._source.generic = false
    delete product._source.status
    delete product._source.classification

    result.set(ean, {
      EAN: ean,
      _id: product._source.id,
      _score: product._score,
      ...product._source,
    })
  })

  return result
}


module.exports = async (searchResponse, tenant, storeId) => {
  try {
    const store = await StoreRepository.repo().findById(storeId)
    const retrieved = await retrieve({ searchResponse, tenant, store })

    const products = Array.from(retrieved.values())

    return products.sort((a, b) => {
      if (a.generic === b.generic) {
        return b._score - a._score
      }

      if (a.generic) {
        return 1
      }

      if (b.generic) {
        return -1
      }

    })

  } catch (error) {
    console.log(error)
    return []
  }
}