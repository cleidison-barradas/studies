import Order from "../../interfaces/order"

export interface ResponseStoneCreateOrder {
  order: Order
  error?: string
}
