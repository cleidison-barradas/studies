import ShowcaseProduct from './showcaseProduct'
export default interface Showcase {
  _id?: string
  name: string
  initialDate?: Date
  finalDate?: Date
  products: ShowcaseProduct[]
  position?: number
  main: boolean
  smart: boolean
  smartFilters?: {
    quantity: number
    control: boolean
  }
  status: boolean
  updatedAt?: Date
  createdAt?: Date
}
