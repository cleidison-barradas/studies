import Product from './product'

export default interface ProductOrder {
    _id: string
    product: Product
    name: string
    unitaryValue: number
    promotionalPrice: number
    amount: number
}
