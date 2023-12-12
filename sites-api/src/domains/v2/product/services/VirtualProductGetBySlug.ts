import { VirtualProduct, VirtualProductRepository } from '@mypharma/api-core'

interface ProductGetBySlugServiceDTO {
  slug: string
  tenant: string
}

class VirtualProductGetBySlugService {
  constructor(private repository?: any) { }

  public async getProductBySlug({ slug, tenant }: ProductGetBySlugServiceDTO) {
    let product = new VirtualProduct()

    if (!this.repository) {

      product = await VirtualProductRepository.repo(tenant).findOne({
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

export default VirtualProductGetBySlugService
