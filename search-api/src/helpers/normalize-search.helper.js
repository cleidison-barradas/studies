// Sentry
const Sentry = require('@sentry/node')

// Redis
const { redis } = require('../services')

const moment = require('moment')

const { getActiveSpecialPrice } = require('./productSpecial')

const grabPatterns = async (productId, productEan, productSlugs, score, patterns, storeId) => {
  const result = []

  if (patterns) {
    let scoreOffset = 0.1
    for await (const pattern of patterns) {
      if (pattern.product_id) {
        const patternProduct = await redis.getProduct({ productId: pattern.product_id })

        if (patternProduct) {
          // Clear redundant patterns
          if (patternProduct.patterns) {
            delete patternProduct.patterns
          }

          const store = patternProduct.stores.find(p => p.store_id === Number(storeId))

          if (store) {
            const specials = patternProduct.specials.filter(p => p.store_id === Number(storeId))
            const slug = patternProduct.slugs.length > 0 ? patternProduct.slugs[0].url : ''

            delete patternProduct.stores
            delete patternProduct.specials

            if (!result.find(p => Number(p.product_id) === Number(patternProduct.product_id))) {
              result.push({
                ...patternProduct,
                ...store,
                specials,
                slug,
                parent: {
                  product_id: productId,
                  ean: productEan,
                  slug: productSlugs.length > 0 ? productSlugs[0].url : ''
                },
                _score: score > 0 ? score - scoreOffset : 0
              })

              scoreOffset += 0.1
            }
          }
        }
      }
    }
  }

  return result
}

const retrieve = async (searchResponse, storeId) => {
  const { hits } = searchResponse

  const result = []
  for await (const { _source, _score } of hits) {
    const { product_id } = _source

    if (result.find(p => Number(p.product_id) === Number(product_id)) === undefined) {
      const product = await redis.getProduct({ productId: product_id })

      if (product) {
        const store = product.stores.find(p => p.store_id === Number(storeId.storeId))
        let specials = product.specials.filter(p => p.store_id === Number(storeId.storeId))
        const pmcValues = product.pmc_values ? product.pmc_values.find(p => p.region_id === Number(storeId.pmcId || 0)) : null

        // Grab patterns
        const patternGenerics = await grabPatterns(product.product_id, product.ean, product.slugs, _score, product.patterns.generics, storeId.storeId)

        delete product.stores
        delete product.specials
        delete product.patterns
        delete product.pmc_values
      
        if (store) {
          if (!result.find(x => Number(x.product_id) === Number(product.product_id))) {
            product.slug = product.slugs.length > 0 ? product.slugs[0].url : ''

            const special = getActiveSpecialPrice(specials)

            if (!special && storeId.pmcId && pmcValues) {
              
              if (pmcValues) {
                const pmcDiscount = (pmcValues.pmc_value - store.price) / pmcValues.pmc_value * 100

                if (pmcDiscount >= 5) {

                  specials = [
                    {
                      store_id: storeId.storeId,
                      price: store.price,
                      date_start: moment().subtract(1, 'day').format('YYYY-MM-DD'),
                      date_end: moment().add(1, 'week').format('YYYY-MM-DD')
                    }
                  ]
                  store['price'] = pmcValues.pmc_value
                }
              }
            }

            result.push({
              _score: store.quantity > 0 ? _score : 0.0,
              ...product,
              ...store,
              specials,
              generic: false
            })

          }

          // Insert generics if not exist
          patternGenerics.forEach(pattern => {
            if (!result.find(x => Number(x.product_id) === Number(pattern.product_id))) {
              result.push({
                ...pattern,
                //_score: pattern.quantity > 0 ? _score : 0.0,
                generic: true
              })
            }
          })
        }
      }
    }
  }

  return result
}

module.exports = async (searchResponse, store) => {
  try {
    const products = await retrieve(searchResponse, store)

    return products.sort((a, b) => {
      if (a.quantity > 0 && b.quantity > 0) {
        if (a.generic === b.generic) {
          return b._score - a._score
        }

        if (a.generic) {
          return 1
        }

        if (b.generic) {
          return -1
        }
      }

      return b.quantity - a.quantity
    })
  } catch (err) {
    Sentry.captureException(err)

    return []
  }
}
