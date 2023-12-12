/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product, ProductRepository } from '@mypharma/api-core'
import { ObjectId } from 'bson'

interface ProductGetByProductIdServiceDTO {
  productId: string
}

class ProductGetByProductIdService {
  constructor(private repository?: any) { }

  public async getProductByProductId({ productId }: ProductGetByProductIdServiceDTO): Promise<Product> {
    let product = new Product()
    const _id = new ObjectId(productId)

    if (!this.repository) {
      product = await ProductRepository.repo().findById(_id)
    }

    if (!product) {

      throw new Error('product_not_found')
    }

    return product
  }
}

export default ProductGetByProductIdService