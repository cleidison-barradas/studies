import { ICustomer, IXlsCustomer } from "../../../../interfaces/customer"
import { IGenericFieldSchema } from "../../../../interfaces/generic-field-type"

const CUSTOMER_SCHEMA: IGenericFieldSchema = {
  nome: {
    type: 'string',
    fieldName: 'name'
  },
  email: {
    type: 'string',
    fieldName: 'email'
  },
  contato: {
    type: 'string',
    fieldName: 'phone'
  }
}

export const fixCustomerFieldType = (customers: IXlsCustomer[] = []) => {
  const SchemaKeys = Object.keys(CUSTOMER_SCHEMA)

  return customers.map(customer => {
    let obj: ICustomer | null = null

    Object.keys(customer).forEach(key => {
      const index = SchemaKeys.indexOf(key)

      if (index !== -1) {
        const { fieldName, type } = CUSTOMER_SCHEMA[SchemaKeys[index]]
        const value = type === 'string' ? String(customer[key]).toString() : customer[key]

        obj = {
          ...obj,
          [fieldName]: value
        }
      }
    })
    return obj
  })
}