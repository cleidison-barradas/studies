export default interface Category {
  _id?: string
  name: string
  description: string
  metaTitle: string
  metaDescription: string
  image: string
  subCategories?: Category[]
  parentId?: string
  sort: number
  status: boolean
  position: number | null
  updatedAt?: Date
  createdAt?: Date
}
