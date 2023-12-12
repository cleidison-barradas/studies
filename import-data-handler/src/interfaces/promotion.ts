export interface IPromotion {
  EAN: string
  price: number
  date_start: string
  date_end: string
}

export interface ISpecial {
  price: number
  date_start: Date
  date_end: Date
}