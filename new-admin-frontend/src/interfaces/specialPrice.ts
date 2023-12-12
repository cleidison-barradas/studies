
type TypeDiscount = "pricePromotion" | "discountPromotion"
type TypePromotion = "product" | "category" | "classification"

export default interface Specials {
    price: number,
    date_start: Date,
    date_end: Date,
    typeDiscount?: TypeDiscount,
    typePromotion?: TypePromotion,
    discountPercentage?: number,
    category?: [],
    classification?: [],
    quantityBlock?: boolean,
    AllChecked?: boolean
}