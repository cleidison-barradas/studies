import Category from './category'
import Product from './product'

export default interface Cupom {
    _id?: string
    name: string
    code: string
    initialDate?: Date
    finalDate?: Date
    amount?: number
    descountPercentage?: number
    type: string
    descountOnProduct?: number
    products?: Product[]
    minimumPrice?: number
    allProducts: boolean
    descountOnDelivery?: number
    timesUsed: number
    status: boolean
    descountCategorys: Category[]
    createdAt?: Date
    updatedAt?: Date
}
