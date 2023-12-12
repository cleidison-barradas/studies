import { IGenericFieldSchema } from "../../../../interfaces/generic-field-type"
import { PMCData, XLSPMCData } from "../../../../interfaces/pmc"

const PMC_SCHEMA: IGenericFieldSchema = {
  'EAN 1': {
    type: 'string',
    fieldName: 'ean'
  },
  'PMC 17%': {
    type: 'number',
    fieldName: 'region_4'
  },
  'PMC 17,5%': {
    type: 'number',
    fieldName: 'region_3'
  },
  'PMC 18%': {
    type: 'number',
    fieldName: 'region_2'
  },
  'PMC 20%': {
    type: 'number',
    fieldName: 'region_1'
  },
  'PMC 12%': {
    type: 'number',
    fieldName: 'region_5'
  }
}

export const fixPMCFieldType = (pmcs: XLSPMCData[] = []) => {
  const SchemaKeys = Object.keys(PMC_SCHEMA)

  return pmcs.map(pmc => {
    let obj: PMCData | null = null

    Object.keys(pmc).forEach(key => {
      const index = SchemaKeys.indexOf(key)

      if (index !== -1) {
        const { fieldName, type } = PMC_SCHEMA[SchemaKeys[index]]
        const value = type === 'string' ? String(pmc[key]).toString() : Number(String(pmc[key]).replace(/,/g, '.'))

        obj = {
          ...obj,
          [fieldName]: value
        }
      }
    })
    return obj
  })
}