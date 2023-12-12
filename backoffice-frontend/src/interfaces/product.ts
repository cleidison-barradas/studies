import Category from './category'
import Manufacturer from './manufacturer'
import Classification from './classification'
import Control from './control'
import File from './file'

export default interface Product {
  _id?: string
  name: string
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
  category?: Category[]
  price?: number
  quantity: number
  metaTitle?: string
  metaDescription?: string
  updatedAt?: Date
  createdAt?: Date
  [key: string]: any
}
