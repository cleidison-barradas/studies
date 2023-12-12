export default interface Category {
    _id?: string
    name: string
    description: string
    metaTitle: string
    metaDescription: string
    image: string
    subCategories?: Category[]
    parent?: string
    sort: number
    status: boolean
    updatedAt?: Date
    createdAt?: Date
}
