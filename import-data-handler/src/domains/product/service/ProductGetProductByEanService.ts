import { Product, ProductRepository } from "@mypharma/api-core"

interface RequestProductGetProductByEanServiceDTO {
  EAN: string
  tenant: string
}

class ProductGetProductByEanService {
  constructor(private repository?: any) { }

  public async getProductByEan({ EAN, tenant }: RequestProductGetProductByEanServiceDTO) {
    let product = new Product()

    if (!this.repository) {
      product = await ProductRepository.repo(tenant).findOne({
        where: { EAN }
      })
    }

    if (!product) {
      throw Error('product_not_found')
    }
    return product
  }
}

export default ProductGetProductByEanService