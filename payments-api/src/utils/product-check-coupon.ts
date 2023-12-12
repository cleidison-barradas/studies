import { Cart, ProductRepository, Product, Cupom } from '@mypharma/api-core'
import { IPutCartRequest } from '../domains/v1/cart/interfaces/cart.request'
import * as moment from 'moment'
import SpecialPrice from './special-product-price'

export async function ParseProductCoupom(tenant: string, cupom: Cupom, productsOnCart: IPutCartRequest['products']) {
  const promises = []
  const products = []
  let deliveryFree = false
  let total = 0
  let price = 0

  try {
    if (!cupom) {
      return productsOnCart
    }
    const {
      initialDate,
      finalDate,
      type,
      allProducts,
      products: productsIds = [],
      descountCategorys: categoriesId = [],
      minimumPrice,
      descountPercentage,
    } = cupom

    const dateStart = moment(initialDate, 'YYYY-MM-DD')
    const dateEnd = moment(finalDate, 'YYYY-MM-DD')
    const now = moment()

    if (!(now.isSameOrAfter(dateStart) && now.isSameOrBefore(dateEnd))) {
      return productsOnCart
    }

    productsOnCart.forEach((p) => {
      const { id, price, quantity } = p
      total += Number(quantity) * Number(price)
      promises.push(ProductRepository.repo<ProductRepository>(tenant).findById(id))
    })

    if (type.toLowerCase() === 'product') {
      const productsToCompare = (await Promise.all(promises)) as Product[]

      productsOnCart.map((p) => {
        const { id, model, name, slug, quantity, maxQuantity } = p
        const product = productsToCompare.find((x) => x._id.toString() === id.toString())
        // check is product has special price active
        const special = SpecialPrice(product.specials)

        const productPrice = special ? special.price : product.price
        const discount = (descountPercentage / 100) * productPrice

        if (productsIds.filter((x) => x.toString() === id.toString()).length > 0 && !allProducts) {
          if (minimumPrice > 0) price = total >= minimumPrice ? productPrice - discount : productPrice
          else price = productPrice - discount

          products.push({
            id,
            name,
            slug,
            model,
            price,
            quantity,
            maxQuantity,
          })
        } else if (allProducts) {
          if (minimumPrice > 0) price = total >= minimumPrice ? productPrice - discount : productPrice
          else price = productPrice - discount

          products.push({
            id,
            name,
            slug,
            model,
            price,
            quantity,
            maxQuantity,
          })
        } else {
          products.push({
            id,
            name,
            slug,
            model,
            price: productPrice,
            quantity,
            maxQuantity,
          })
        }
      })
    }

    if (type.toLowerCase() === 'category') {
      const productsToCompare = (await Promise.all(promises)) as Product[]
      const producstInCategories: Product[] = []

      productsToCompare.map((p) => {
        const isFromCategory = p.category.filter((c) => categoriesId.filter((x) => x.toString() === c._id.toString()).length > 0).length > 0
        if (isFromCategory) {
          producstInCategories.push(p)
        }
      })

      productsOnCart.map((p) => {
        const { id, name, model, slug, quantity, maxQuantity } = p
        const productExists = producstInCategories.find((x) => x._id.toString() === id)

        if (productExists) {
          // check is product has special price active
          const special = SpecialPrice(productExists.specials)
          const productPrice = special ? special.price : productExists.price

          const discount = (descountPercentage / 100) * productPrice

          if (minimumPrice > 0) price = total >= minimumPrice ? productPrice - discount : productPrice
          else price = productPrice - discount

          products.push({
            id,
            name,
            slug,
            model,
            price,
            quantity,
            maxQuantity,
          })
        } else {
          products.push({
            id,
            name,
            slug,
            model,
            price: p.price,
            quantity,
            maxQuantity,
          })
        }
      })
    }

    if (type.toLowerCase() === 'delivery') {
      if (minimumPrice > 0) deliveryFree = total >= minimumPrice ? true : false
      else deliveryFree = true
    }

    return products as Cart['products']
  } catch (error) {
    console.log(error)
    return products
  }
}
