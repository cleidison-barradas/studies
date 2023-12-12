import { ORM, StoreRepository, ProductRepository } from '@mypharma/api-core'
import { IProductStore, RedisPlugin } from '@mypharma/etl-engine'
// Sentry
import { captureException } from '@sentry/node'

/**
 * Get products cached or cache products from database
 * 
 * @param storeId 
 */
export const getProductCache = async (storeId: number): Promise<IProductStore[]> => {
  try {
    const redisKey = `etl_products_${storeId}`

    let products = await RedisPlugin.get(redisKey, 0, -1) as Array<any> || []

    // We do have this store products cached
    if (products && products.length > 0) {
      return products
    }

    // Check if store is into new infra
    const store = await StoreRepository.repo().findByOriginalId(storeId)

    if (store) {
      // Setup store tenant
      await ORM.setup(null, store.tenant)
      let uniqueProducts = new Map<string, any>([])

      const paginatedProducts = await ProductRepository.repo(store.tenant).find({
        select: [
          'EAN',
          'name',
          'price',
          'quantity',
          'createdAt',
          'updatedAt',
          'lastStock',
          'updateOrigin'
        ]
      })

      paginatedProducts.forEach((v, index) => {
        if (!uniqueProducts.has(v.EAN)) {
          uniqueProducts.set(v.EAN, {
            ean: v.EAN,
            store_id: storeId,
            product_id: index + 1, // We do not support this anymore
            name: v.name || null,
            price: Number(v.price),
            quantity: Number(v.quantity),
            date_added: v.createdAt,
            date_modified: v.updatedAt,
            last_stock: v.lastStock,
            update_origin: v.updateOrigin
          })
        }
      })

      products = Array.from(uniqueProducts.values())
      uniqueProducts.clear()
      uniqueProducts = null
      await ORM.closeConnection(store.tenant)
    }

    console.log(`sending ${products.length} remote products to ${store ? store.tenant : storeId}`)

    // Remove old values
    await RedisPlugin.remove(redisKey)
    // Cache 15 mim
    await RedisPlugin.push(redisKey, products, 60 * 5)

    return products

  } catch (err) {
    console.log(err)
    captureException(err)

    return []
  }
}
