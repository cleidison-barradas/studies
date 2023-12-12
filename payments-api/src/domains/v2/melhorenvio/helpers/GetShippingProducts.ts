import { OrderProducts } from '@mypharma/api-core'

export function getShippingProducts(orderProducts: OrderProducts[]) {

  return orderProducts.map(orderProduct => {
    const name = orderProduct.product.name
    const quantity = orderProduct.amount

    const unitary_value = orderProduct.promotionalPrice < orderProduct.unitaryValue ? orderProduct.promotionalPrice : orderProduct.unitaryValue

    return {
      name,
      quantity,
      unitary_value
    }
  })
}
