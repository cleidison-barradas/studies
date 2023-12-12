import Category from './category'
import Manufacturer from './manufacturer'
import Classification from './classification'
import Control from './control'
import File from './file'
import Specials from './specialPrice'
import { Benefit } from './benefit'

export default interface Product {
  _id: string
  name: string
  model: string
  EAN: string
  MS?: string
  presentation?: string
  description: string
  manufacturer?: Manufacturer
  classification?: Classification
  control?: Control
  buyOneGetTwo: boolean
  updateOrigin: 'Docas'
  activePrinciple?: string
  status: boolean
  verify?: boolean
  image?: File
  slug: string[]
  category?: Category[]
  price: number
  quantity: number
  metaTitle?: string
  metaDescription?: string
  specials: Specials[]
  updatedAt?: Date
  createdAt?: Date
  manualPMC?: false
  pmcPrice?: number
  weigth?: number
  width?: number
  length?: number
  heigth?: number
  leaflet?: string
  benefit?: Benefit
  benefit_sale_price?: number
  [key: string]: any
}
