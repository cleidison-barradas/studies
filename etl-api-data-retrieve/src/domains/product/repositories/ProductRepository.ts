import { BaseRepository } from '../../../support/repositories/BaseRepository'
import {
  // Interfaces
  IProduct,
  IProductStore,
  
  // Plugins
  MySQLPlugin
} from '@mypharma/etl-engine'

class ProductRepository extends BaseRepository<IProduct> {
  public async getStoreProducts(storeId: number) {
    const sql = `
      SELECT 
        pm.product_id,
        pr.ean,
        CONCAT(pd.name, ' ', pr.model) as name,
        pm.store_id,
        pm.price,
        pm.quantity,
        pm.date_added,
        pm.date_modified,
        pm.last_stock,
        pm.update_origin
      FROM oc_product_to_multistore AS pm
      INNER JOIN oc_product AS pr ON pr.product_id = pm.product_id
      INNER JOIN oc_product_description AS pd ON pd.product_id = pm.product_id
      WHERE pm.store_id = ?
    `

    const query = await MySQLPlugin.query(sql, [storeId])
    return query.length > 0 ? query[0] as IProductStore[] : []
  }
}

export const productRepository = new ProductRepository('oc_product')
