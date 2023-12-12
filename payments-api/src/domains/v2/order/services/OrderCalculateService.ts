import { DeliveryFee, DistanceDeliveryFee, OrderProducts } from '@mypharma/api-core'

interface OrderCalculateServiceDTO {
  products: OrderProducts[],
  deliveryData?: DeliveryFee | DistanceDeliveryFee
}

class OrderCalculateService {

  public execute({ products, deliveryData }: OrderCalculateServiceDTO) {
    let subTotal = 0
    const feePrice = deliveryData ? deliveryData.feePrice : 0
    const freeFrom = deliveryData ? deliveryData.freeFrom : 0

    products.forEach(_product => {
      const { amount, promotionalPrice, unitaryValue } = _product
      const price = promotionalPrice < unitaryValue ? promotionalPrice : unitaryValue

      subTotal += amount * price
    })

    const fee = freeFrom > 0 && subTotal >= freeFrom ? 0 : feePrice


    return subTotal + fee
  }
}

export default OrderCalculateService
