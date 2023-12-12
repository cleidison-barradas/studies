import { Cupom, Product } from "@mypharma/api-core"

interface RequestProductGetPromotionalPriceServiceDTO {
  cupom?: Cupom
  product: Product
}

class ProductGetPromotionalPriceService {

  public execute({ product, cupom = null }: RequestProductGetPromotionalPriceServiceDTO) { }

}

export default ProductGetPromotionalPriceService