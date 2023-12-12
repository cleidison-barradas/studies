
interface ExtrasModule {
  [key: string]: any
}

export default interface IntegrationModule {
  _id?: string
  name: string
  code: string
  type: string
  baseUrl: string
  imageUrl: string
  extras: ExtrasModule
  description: string
}