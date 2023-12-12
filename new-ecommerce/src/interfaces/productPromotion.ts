import Product from "./product"

export default interface ProductPromotion {
    _id? : string,
    price: number,
    initialDate: Date,
    finalDate?: Date,
    products: Product[]
    createdAt?: Date,
    updatedAt?: Date,
    published : boolean,
    title : string,
}