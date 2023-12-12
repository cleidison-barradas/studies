export interface IConnectionData {
  EAN: string
  name: string
  price: number
  quantity: number
  lastStock?: Date
  erp_pmc: number
  laboratory?: string
  presentation?: string
}
