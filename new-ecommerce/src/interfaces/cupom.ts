export type ICupomType = 'PRODUCT' | 'CATEGORY'

export default interface Cupom {
  _id?: string
  name: string
  code: string
  amount: number
  status: boolean
  type: ICupomType
  timesUsed: number
  allProducts: boolean
  minimumPrice: number
  initialDate?: Date
  finalDate?: Date
  products: string[]
  descountPercentage: number
  descountOnProduct?: number
  descountOnDelivery?: number
  productBlacklist: string[]
  descountCategorys: string[]
  createdAt?: Date
  updatedAt?: Date
}
