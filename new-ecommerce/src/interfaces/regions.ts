import Neighborhood from "./neighborhood"

export default interface Region {
  _id: string
  deliveryTime: number
  feePrice: number
  freeFrom: number
  minimumPurchase: number
  neighborhood: Neighborhood
  updatedAt?: Date
  createdAt?: Date
}
