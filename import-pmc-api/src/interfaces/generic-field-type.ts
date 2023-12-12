
type FieldType = 'string' | 'number'

export interface IGenericFieldSchema {
  [key: string]: {
    type: FieldType
    fieldName: string
  }
}