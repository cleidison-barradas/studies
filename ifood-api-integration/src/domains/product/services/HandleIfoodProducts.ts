import { Product, Store } from "@mypharma/api-core"
import { RedisPlugin } from "@mypharma/etl-engine"
import IFoodPlugin from '../../../support/plugins/ifood'

import { parser } from "../helpers/productIfoodParser"
import { productDelta } from "../helpers/productDelta"
import { getProducts } from "../helpers/GetProducts"


import { IfoodConnection } from "../../../interfaces/ifoodProductsKey"
import { IFoodProducts } from '../../../interfaces/productIfood'

export const handleProduct = async (connection: IfoodConnection, store: Store) => {
  const { tenant, clientStoreId, accessToken, limitSentProducts } = connection
  const productsKey = `ifood_products_${store._id}`

  let eans: string[] = []
  let products: Product[] = []

  let sentProducts = await RedisPlugin.get(productsKey, 0, -1) as Array<IFoodProducts> || []

  const sending = sentProducts.length < limitSentProducts

  eans = sentProducts.length > 0 ? sentProducts.map(x => x.codigoBarra) : []

  eans = sending ? eans : []

  products = await getProducts(tenant, eans)

  if (!sending) {

    products = productDelta(products, sentProducts)
  }

  products = products.length > 0 && products.length > 5000 ? products.slice(0, 5000) : products

  const parsedProducts = parser({ products, storeId: String(clientStoreId), store })

  if (parsedProducts.length > 0) {

    const { data } = await IFoodPlugin.sendProducts(parsedProducts, accessToken, true)

    if (data instanceof Array && !data[0].success) {

      console.log(data[0].error)
      throw new Error('failure_on_sent_products')
    }
  }

  parsedProducts.forEach(_parsedProduct => {
    const index = sentProducts.findIndex(sentProduct => sentProduct.codigoBarra === _parsedProduct.codigoBarra)

    if (index !== -1) {
      sentProducts.splice(index, 1)
      sentProducts.push(_parsedProduct)

    } else {

      sentProducts.push(_parsedProduct)
    }
  })

  // Remove old products cache
  await RedisPlugin.remove(productsKey)

  // Set new products cache
  await RedisPlugin.push(productsKey, sentProducts)

  console.log(`Worker #${process.pid} sending ${parsedProducts.length} products to ifood total: ${sentProducts.length} store: ${tenant}`)

  // free memory
  eans = []
  products = []
  sentProducts = []

  return parsedProducts
}
