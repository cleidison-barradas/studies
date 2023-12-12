export default interface DistanceDeliveryFee {
    _id: string,
    deliveryTime: number,
    feePrice: number,
    freeFrom: number,
    minimumPurchase: number,
    distance: number,
    createdAt?: Date,
    updatedAt?: Date,
}

export function isDistanceDeliveryFee(obj: any): obj is DistanceDeliveryFee {
    return (
      typeof obj === 'object' &&
      typeof obj._id === 'string' &&
      typeof obj.deliveryTime === 'number' &&
      typeof obj.feePrice === 'number' &&
      typeof obj.freeFrom === 'number' &&
      typeof obj.minimumPurchase === 'number' &&
      typeof obj.distance === 'number'
    )
  }