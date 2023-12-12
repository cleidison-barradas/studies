
type FieldType = 'string' | 'number'

export interface IProductType {
  [key: string]: {
    type: FieldType,
    required?: boolean
    defaultSeparator?: string
  }
}
