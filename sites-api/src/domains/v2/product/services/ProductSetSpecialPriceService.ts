import { Product, Store } from '@mypharma/api-core'
import * as moment from 'moment'

interface RequestProductSetSpecialPriceServiceDTO {
  store: Store
  products: Product[]
}

class ProductSetSpecialPriceService {
  constructor(private repository?: any) { }

  public async setProductSpecialPrice({ store, products = [] }: RequestProductSetSpecialPriceServiceDTO) {
    const _products: Product[] = []

    if (products.length <= 0) return products

    if (!this.repository) {
      const today = moment()

      products.forEach(_product => {
        const { price, erp_pmc = 0, manualPMC = false, pmcValues = [] } = _product

        let specials = _product.specials

        const special = specials && specials.length > 0 ? specials[0] : null

        if (special) {

          if (!today.isBetween(moment(special.date_start), moment(special.date_end))) {

            specials = []
          }
        }


      })
    }

    return _products
  }
}

export default ProductSetSpecialPriceService
