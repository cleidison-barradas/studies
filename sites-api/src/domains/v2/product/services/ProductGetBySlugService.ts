import { Product, ProductRepository } from '@mypharma/api-core'

interface ProductGetBySlugServiceDTO {
  slug: string
  tenant: string
}

class ProductGetBySlugService {
  constructor(private repository?: any) { }

  public async getProductBySlug({ slug, tenant }: ProductGetBySlugServiceDTO) {
    let product = new Product()

    if (!this.repository) {

      product = await ProductRepository.repo(tenant).findOne({
        where: {
          slug: [slug]
        }
      })
    }

    if (!product) {

      throw new Error('product_not_found')
    }

    return product
  }
}

export default ProductGetBySlugService
