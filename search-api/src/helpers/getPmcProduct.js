const moment = require('moment')
const { Product, Store } = require('@mypharma/api-core')
const { getActiveSpecialPrice } = require('./productSpecial')
/**
 * 
 * @param {Partial<Product>} product 
 * @param {Store} store 
 */
module.exports = (product, store) => {
  const { price, manualPMC = false, erp_pmc = 0, pmcPrice = 0, pmcValues = [], specials = [] } = product

  const special = getActiveSpecialPrice(specials)

  if (special) {

    product.specials = [special]

    return product
  }

  const date_end = moment().add(1, 'week').toDate()
  const date_start = moment().subtract(1, 'day').toDate()
  product.specials = []

  if (manualPMC && Number(pmcPrice) > 0) {
    const pmcDiscount = (pmcPrice - price) / pmcPrice * 100

    if (pmcDiscount >= 5) {

      product.specials.push({
        date_end,
        date_start,
        price: Number(product.price)
      })

      product.price = Number(pmcPrice)

      return product
    }
  }

  if (erp_pmc && Number(erp_pmc) > 0) {
    const pmcDiscount = (erp_pmc - price) / erp_pmc * 100

    if (pmcDiscount >= 5) {

      product.specials.push({
        date_end,
        date_start,
        price: Number(product.price)
      })

      product.price = Number(erp_pmc)

      return product
    }
  }

  if (store.pmc && pmcValues && pmcValues.length > 0) {
    const pmcValue = product.pmcValues.find(x => x.region_id.toString() === store.pmc._id.toString())

    if (pmcValue) {
      const pmcDiscount = (pmcValue.value - price) / pmcValue.value * 100

      if (pmcDiscount >= 5) {

        product.specials.push({
          date_end,
          date_start,
          price: Number(product.price)
        })

        product.price = Number(pmcValue.value)

        return product
      }
    }
  }

  return product
}