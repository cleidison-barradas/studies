import { IProduct, IXlsProduct } from "../../../../interfaces/product"
import { IGenericFieldSchema } from "../../../../interfaces/generic-field-type"

const PRODUCT_SCHEMA: IGenericFieldSchema = {
  ean: {
    type: 'string',
    fieldName: 'EAN'
  },
  preco: {
    type: 'number',
    fieldName: 'price'
  },
  estoque: {
    type: 'number',
    fieldName: 'quantity'
  },
  nome: {
    type: 'string',
    fieldName: 'name'
  },
  apresentacao: {
    type: 'string',
    fieldName: 'presentation'
  },
  principio_ativo: {
    type: 'string',
    fieldName: 'activePrinciple'
  },
  laboratorio: {
    type: 'string',
    fieldName: 'laboratory'
  }
}


export const fixProductFieldType = (products: IXlsProduct[] = []) => {
  const SchemaKeys = Object.keys(PRODUCT_SCHEMA)

  return products.map(product => {
    let obj: IProduct | null = null

    Object.keys(product).forEach(key => {
      const index = SchemaKeys.indexOf(key)

      if (index !== -1) {
        const { fieldName, type } = PRODUCT_SCHEMA[SchemaKeys[index]]
        const value = type === 'string' ? String(product[key]).toString() :
          fieldName.includes('quantity') ?
            Number.parseInt(String(product[key]).replace(/,/g, '.')) :
            Number(String(product[key]).replace(/,/g, '.'))

        obj = {
          ...obj,
          [fieldName]: value
        }
      }
    })
    return obj
  })
}