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