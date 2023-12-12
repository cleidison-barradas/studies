export interface IProductResponse {
  EAN: string
  name: string
  price: number
  lastStock?: Date
  erp_pmc?: number
  specials?: number
  quantity: number
  laboratory?: string
  presentation?: string
}
