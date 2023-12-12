import { ProductRepository } from "@mypharma/api-core"


interface ProductGetProductByEansServiceDTO {
  EANS: string[]
  tenant: string
}

class ProductGetProductByEansService {
  constructor(private repository?: any) { }

  public async getProductsByEans({ EANS, tenant }: ProductGetProductByEansServiceDTO) {

    return ProductRepository.repo(tenant).find({
      where: {
        EAN: { $in: EANS }
      }
    })

  }
}

export default ProductGetProductByEansService