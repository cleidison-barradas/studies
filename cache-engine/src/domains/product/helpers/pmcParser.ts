import { Product, Store } from "@mypharma/api-core"
import moment from "moment"
import { specialPrice } from "./specialPrice"

export const productPmcParser = (product: Product, store: Store) => {
  const { erp_pmc = 0, pmcPrice = 0, pmcValues, specials = [], price, manualPMC = false } = product

  const special = specialPrice(specials)

  if (special) {
    return {
      specials: [
        {
          ...special,
          store_id: store._id
        }
      ],
      price: product.price
    }
  }

  if (erp_pmc && Number(erp_pmc) > 0 && Number(erp_pmc) > Number(price)) {

    return {
      specials: [
        {
          price,
          store_id: store._id,
          date_start: moment().subtract(1, 'day').format('YYYY-MM-DD'),
          date_end: moment().add(1, 'week').format('YYYY-MM-DD')
        }
      ],
      price: erp_pmc
    }
  }

  if (manualPMC && Number(pmcPrice) > 0) {
    const pmcDiscount = (pmcPrice - price) / pmcPrice * 100

    if (pmcDiscount >= 5) {

      return {
        specials: [
          {
            price,
            store_id: store._id,
            date_start: moment().subtract(1, 'day').format('YYYY-MM-DD'),
            date_end: moment().add(1, 'week').format('YYYY-MM-DD')
          }
        ],
        price: pmcPrice
      }
    }
  }

  if (store.pmc && pmcValues && pmcValues.length > 0) {
    const pmcValue = pmcValues.find(x => x.region_id.toString() === store.pmc._id.toString())

    if (pmcValue) {
      const pmcDiscount = (pmcValue.value - price) / pmcValue.value * 100

      if (pmcDiscount >= 5) {
        return {
          specials: [
            {
              price,
              store_id: store._id,
              date_start: moment().subtract(1, 'day').format('YYYY-MM-DD'),
              date_end: moment().add(1, 'week').format('YYYY-MM-DD')
            }
          ],
          price: pmcValue.value
        }
      }
    }
  }

  return {
    price,
    specials: []
  }
}