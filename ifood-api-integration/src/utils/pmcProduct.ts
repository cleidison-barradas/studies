import { Product, Store } from "@mypharma/api-core"

export function getProductPMC(product: Product, store: Store) {
  const { price, manualPMC = false, erp_pmc = 0, pmcPrice = 0, pmcValues = [] } = product

  if (manualPMC && Number(pmcPrice) > 0) {
    const pmcDiscount = (pmcPrice - price) / pmcPrice * 100

    if (pmcDiscount >= 5) {

      return pmcPrice
    }
  }

  if (erp_pmc && Number(erp_pmc) > 0) {
    const pmcDiscount = (erp_pmc - price) / erp_pmc * 100

    if (pmcDiscount >= 5) {

      return erp_pmc
    }
  }

  if (store.pmc && pmcValues && pmcValues.length > 0) {
    const pmcValue = product.pmcValues.find(x => x.region_id.toString() === store.pmc._id.toString())

    if (pmcValue) {
      const pmcDiscount = (pmcValue.value - price) / pmcValue.value * 100

      if (pmcDiscount >= 5) {

        return pmcValue.value
      }
    }
  }

  return null
}