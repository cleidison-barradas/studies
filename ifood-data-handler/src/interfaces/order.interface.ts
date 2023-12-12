import { Product } from "@mypharma/api-core";

export interface OrderProducts {
  product: Product
  amount: number
  unitaryValue: number
  promotionalPrice: number
}