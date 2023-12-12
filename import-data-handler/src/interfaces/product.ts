import { IUpdateOrigin } from "./updateOrigin"

export interface IProduct {
  EAN: string
  name: string
  price: number
  quantity: number
  laboratory?: string
  presentation?: string
  activePrinciple?: string
  updateOrigin: IUpdateOrigin
}