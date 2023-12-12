
import Product from "./product"

export default interface ProductPromotion {
    _id?: string,
    price: number,
    discountPercentage?: number,
    typePromotion?: string,
    typeDiscount?: string,
    classification?: string[],
    category?: string[],
    initialDate?: Date,
    finalDate?: Date,
    products: Product[],
    createdAt?: Date,
    updatedAt?: Date,
    published: boolean,
    title: string,
    quantityBlock?: boolean,
    AllChecked?: boolean
}