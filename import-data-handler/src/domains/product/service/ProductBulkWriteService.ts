import { ProductRepository } from "@mypharma/api-core"

interface ProductBulkWriteServiceDTO {
  tenant: string
  bulkWrite: any[]
}

class ProductBulkWriteService {
  constructor(private repository?: any) { }

  public async bulkWriteProduct({ tenant, bulkWrite }: ProductBulkWriteServiceDTO) {

    if (!this.repository) {

      return ProductRepository.repo(tenant).bulkWrite(bulkWrite)
    }
  }
}

export default ProductBulkWriteService