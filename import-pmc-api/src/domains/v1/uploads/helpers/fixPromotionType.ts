import { IPromotion, IXlsPromotion } from "../../../../interfaces/product"
import { IGenericFieldSchema } from "../../../../interfaces/generic-field-type"

const PROMOTION_SCHEMA: IGenericFieldSchema = {
  ean: {
    type: 'string',
    fieldName: 'EAN'
  },
  preco: {
    type: 'number',
    fieldName: 'price'
  }
}

export const fixPromotionFieldType = (promotions: IXlsPromotion[] = [], date_start: string, date_end: string) => {
  const SchemaKeys = Object.keys(PROMOTION_SCHEMA)

  return promotions.map(promotion => {
    let obj: IPromotion | null = null

    Object.keys(promotion).forEach(key => {
      const index = SchemaKeys.indexOf(key)

      if (index !== -1) {
        const { fieldName, type } = PROMOTION_SCHEMA[SchemaKeys[index]]
        const value = type === 'string' ? String(promotion[key]).toString() : Number(String(promotion[key]).replace(/,/g, '.'))

        obj = {
          ...obj,
          [fieldName]: value,
          date_start,
          date_end
        }
      }
    })
    return obj
  })
}