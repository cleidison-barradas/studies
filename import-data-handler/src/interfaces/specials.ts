type TypeDiscount = 'pricePromotion' | 'discountPromotion'
type TypePromotion = 'product' | 'category' | 'classification'
type typeArray = {_id: string, name: string}
export interface ISpecials {
    products?: [],
    price: number,
    date_start: Date,
    date_end: Date,
    typeDiscount: TypeDiscount,
    typePromotion: TypePromotion,
    discountPercentage?: number,
    category?: typeArray[],
    classification?: typeArray[],
    quantityBlock?: boolean,
    AllChecked?: boolean
}