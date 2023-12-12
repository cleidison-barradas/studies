
type TypeDiscount = 'pricePromotion' | 'discountPromotion'
type TypePromotion = 'product' | 'category' | 'classification'

export interface ISpecials {
  typePromotion?: TypePromotion,  
  typeDiscount?: TypeDiscount,
  category?: [],
  classification?: [],
  quantityBlock?: boolean,
  AllChecked?: boolean,
  price: number,
  discountPercentage?: number,
  date_start: Date,
  date_end: Date
}
