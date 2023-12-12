// Sentry
const Sentry = require('@sentry/node')

// Redis
const { redis } = require('../services')

const { getActiveSpecialPrice } = require('./productSpecial')

const moment = require('moment')

/**
 * Normalize category products
 * 
 * @param {Object} param
 * @param {Number} param.storeId
 * @param {Object} param.categoryProducts
 * @param {Number} param.pmcId
 */
const normalize = async ({ storeId, categoryProducts, pmcId }) => {
  if (!categoryProducts) return []

  let products = []
  for await (const categoryProduct of categoryProducts) {
    let product = await redis.getProduct({ productId: categoryProduct })

    if (product) {
      let store = product.stores.find(p => Number(p.store_id) === Number(storeId))
      delete product.stores
      const pmc = product.pmc_values ? product.pmc_values.find(p => Number(p.region_id) === Number(pmcId)) : null
      const specials = products.specials ? products.specials.filter(s => Number(s.store_id) === Number(storeId)) : []
      const activeSpecial = getActiveSpecialPrice(specials)
  
      if (store) {
        product.slug = product.slugs.length > 0 ? product.slugs[0].url : ''
        let finalPrice = store.price

        if (pmc && !activeSpecial) {
          delete product.pmc_values
          const { pmc_value } = pmc

          const pmcDiscount = (pmc_value - store.price) / pmc_value * 100

          if (pmcDiscount >= 5) {
            finalPrice = pmc_value

            product.specials = [
              {
                store_id: store.store_id,
                price: store.price,
                date_start: moment().subtract(1, 'day').format('YYYY-MM-DD'),
                date_end: moment().add(1, 'week').format('YYYY-MM-DD')
              }
            ]
            store.price = finalPrice
          }
        }

        products.push({
          ...product,
          ...store,
        })
      }
    }
  }
  return products
}

module.exports = async (storeId, categoryProducts, pmcId) => {
  try {
    let products = await normalize({ categoryProducts, storeId, pmcId })
    return products
  } catch (err) {
    console.log(err)
    Sentry.captureException(err)
  }
}
