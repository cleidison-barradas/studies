import ShowcaseProduct from './showcaseProduct'
export default interface Showcase {
    _id?: string
    name: string
    initialDate?: Date
    finalDate?: Date
    products: ShowcaseProduct[]
    position?: number
    status: boolean
    updatedAt?: Date
    createdAt?: Date
}
