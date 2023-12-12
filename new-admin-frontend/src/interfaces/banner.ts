export default interface Banner {
  _id?: string
  description?: string
  title?: string
  whatsappAction?: boolean
  landlineAction?: boolean
  locationAction?: boolean
  placeholders?: {
    title?: string;
    description?: string;
  },
  image?: {
    name: string
    folder: string
    url: string
    key: string
  }
  url?: string
  updatedAt?: Date
  createdAt?: Date
}
