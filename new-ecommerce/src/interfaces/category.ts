export default interface Category {
  _id?: string
  name: string
  description: string
  metaTitle: string
  metaDescription: string
  image: string
  slug: string
  subCategories: Category[]
  parentId: string
  sort: number
  status: boolean
  updatedAt: Date
  createdAt: Date
  position?: number
}
