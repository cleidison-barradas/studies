import { IUpdateOrigin } from "./updateOrigin"

export interface IXlsProduct {
  ean: string
  nome?: string
  preco: number
  estoque: string
  laboratorio?: string
  apresentacao?: string
  principio_ativo?: string
}

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

export interface IXlsPromotion {
  ean: string
  preco: number
}

export interface IPromotion {
  EAN: string
  price: number
  date_start: string
  date_end: string
}