import { BenefitProductRepository, Cart } from '@mypharma/api-core'
import { TransactionItems } from '../../../../adapters/interfaces/epharma'

interface EpharmaBuildAuthorizeItemsServiceDTO {
  cart?: Cart
  eans: string[]
  tenant: string
}

class EpharmaBuildAuthorizeItemsService {
  constructor(private repository?: any) { }

  public async buildTransactionAuthorizeItems({ tenant, eans, cart = null }: EpharmaBuildAuthorizeItemsServiceDTO) {
    const items: TransactionItems[] = []

    const authorized = await BenefitProductRepository.repo(tenant).find({
      where: {
        ean: { $in: eans }
      }
    })

    if (authorized.length !== eans.length) {

      throw new Error('failure_on_validating_products')
    }

    authorized.forEach(_product => {

      const ean = _product.ean
      const salePrice = _product.salePrice
      const storePrice = _product.maximumPrice
      const productName = _product.name.slice(0, 38)
      const storeMaximumPrice = _product.maximumPrice

      const cartProduct = cart ? cart.products.find(_cartProduct => eans.includes(_cartProduct.product.EAN)) : null

      const quantity = cartProduct ? cartProduct.quantity : 1

      items.push({
        ean,
        quantity,
        salePrice,
        storePrice,
        productName,
        categoryId: 0,
        storeMaximumPrice
      })
    })

    return items
  }
}

export default EpharmaBuildAuthorizeItemsService
