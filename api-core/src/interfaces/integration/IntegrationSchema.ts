export const IntegrationSchemaFieldsArray = ['name', 'laboratory', 'presentation', 'price', 'fullPrice', 'quantity']
export type IntegrationSchemaFields = typeof IntegrationSchemaFieldsArray[number]

export type IntegrationSchemaOptions = {
  required?: boolean
  type?: 'string' | 'number' | 'boolean'
  delta?: boolean
  mergeable?: boolean
}

export type IntegrationSchema = {
  [K in IntegrationSchemaFields]: IntegrationSchemaOptions
}
