import Neighborhood from "./neighborhood"

export default interface DeliveryFee {
    _id: string,
    deliveryTime: number,
    feePrice: number,
    freeFrom: number,
    minimumPurchase: number,
    neighborhood: Neighborhood,
    createdAt?: Date,
    updatedAt?: Date,
}