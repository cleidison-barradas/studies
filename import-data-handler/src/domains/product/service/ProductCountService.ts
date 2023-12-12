import { ProductRepository } from "@mypharma/api-core"

interface RequestProductCountServiceDTO {
  slug: string
  tenant: string
}

class ProductCountService {
  constructor(private repository?: any) { }

  public async productCount({ tenant, slug }: RequestProductCountServiceDTO) {

    if (!this.repository) {

      return ProductRepository.repo(tenant).count({
        slug: slug
      })
    }

    return 0
  }
}

export default ProductCountService