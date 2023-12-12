export default interface Banner {
    _id?: string
    description?: string
    image: {
        name: string
        folder: string
        url: string
        key: string
    }
    updatedAt?: Date
    createdAt?: Date
}
