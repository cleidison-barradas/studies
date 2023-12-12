const { ORM, ProductRepository, StoreRepository, Store } = require('@mypharma/api-core')
const getPmcProduct = require('./getPmcProduct')

const grabPatterns = async (activePrinciples = [], tenant) => {
  return ProductRepository.repo(tenant).find({
    where: {
      activePrinciple: {
        $in: activePrinciples
      },
      classification: { $ne: null },
      'classification.name': 'GENERICO',
      quantity: {
        $gt: 0
      },
      status: true,
    },
    take: 20,
    select: [
      '_id',
      'EAN',
      'name',
      'slug',
      'price',
      'image',
      'status',
      'erp_pmc',
      'benefit',
      'control',
      'specials',
      'pmcPrice',
      'quantity',
      'pmcValues',
      'manualPMC',
      'presentation',
      'manufacturer',
      'classification',
      'activePrinciple',
      'benefit_sale_price'
    ]
  })
}

/**
 * 
 * @param {string} tenant 
 * @param {Array<string>} eans 
 */
const getProducts = async (tenant, eans = []) => {

  return ProductRepository.repo(tenant).find({
    where: {
      status: true,
      deletedAt: null,
      EAN: { $in: eans },
      quantity: { $gt: 0 },
    },
    select: [
      '_id',
      'EAN',
      'name',
      'slug',
      'price',
      'image',
      'status',
      'erp_pmc',
      'benefit',
      'control',
      'specials',
      'pmcPrice',
      'quantity',
      'pmcValues',
      'manualPMC',
      'presentation',
      'manufacturer',
      'classification',
      'activePrinciple',
      'benefit_sale_price'
    ]
  })
}

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

  const eans = hits.map(_hit => _hit._source.ean.toString())

  const products = await getProducts(tenant, eans)

  const activePrinciples = products.filter(_product => _product.activePrinciple && _product.activePrinciple.length > 0).map(_product => _product.activePrinciple)

  const patterns = await grabPatterns(activePrinciples, tenant)

  products.forEach(product => {
    const { EAN, classification, activePrinciple } = product

    if (!result.has(EAN)) {
      const { _score } = hits.find(hit => hit._source.ean.toString() === EAN)

      if (classification && classification.name === 'ETICO' && activePrinciple && activePrinciple.length > 0) {

        let patternsFiltred = patterns.filter(pattern => pattern.EAN !== EAN && pattern.activePrinciple === activePrinciple)

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

      product = getPmcProduct(product, store)
      product.generic = false
      delete product.status
      delete product.classification

      result.set(EAN, {
        ...product,
        _score
      })
    }
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