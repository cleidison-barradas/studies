import Product from "./product"

export default interface Import {
    _id: string,
    status: number,
    invalid_products: [
        {
            product: Product,
            error: string
        }
    ],
    total_products: number,
    total_imported: [
        {
            product: Product,
            action: string
        }
    ],
    createdAt?: Date,
    updatedAt?: Date
}