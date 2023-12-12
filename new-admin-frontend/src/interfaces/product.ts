import Category from './category'
import Manufacturer from './manufacturer'
import Classification from './classification'
import Control from './control'
import File from './file'
import Specials from './specialPrice'

export default interface Product {
  _id?: string
  name: string
  model: string
  EAN: string
  MS?: string
  presentation?: string
  description: string
  manufacturer?: Manufacturer
  classification?: Classification
  control?: Control
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
  specials?: Specials[]
  updatedAt?: Date
  createdAt?: Date
  manualPMC?: false
  pmcPrice?: number
  weigth?: number
  width?: number
  length?: number
  heigth?: number
  [key: string]: any
}
