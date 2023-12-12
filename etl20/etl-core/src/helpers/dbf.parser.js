const ERPS = [
  {
    name: 'SoftClass',
    fields: {
      ean: 'BARRA',
      name: 'DESCRICAO',
      presentation: null,
      price: 'VENDA_ATU',
      quantity: 'ESTOQUE',
    }
  },
  {
    name: 'Microfarma',
    fields: {
      ean: 'CODBARRA',
      name: 'PRDESC',
      presentation: null,
      price: 'PRCONS',
      quantity: 'PRESTQ',
    }
  },
  {
    name: 'SysFarma DBF',
    fields: {
      ean: 'BARRA',
      name: 'DESCRICAO',
      presentation: null,
      price: 'VENDA_ATU',
      quantity: 'ESTOQUE',
    }
  },
  {
    name: 'HOS DBF',
    fields: {
      ean: 'BARRA',
      name: 'DESCRICAO',
      presentation: null,
      price: 'VENDA_ATU',
      quantity: 'ESTOQUE',
    }
  },
  {
    name: 'Reyfarma DBF',
    fields: {
      ean: 'BARRA',
      name: 'DESCRICAO',
      presentation: 'APRESENTA',
      price: 'VENDA_ATU',
      quantity: 'ESTOQUE',
    }
  }
]

/**
 * Parser DBF format
 * 
 * @param {Object} obj
 * @param {String} erpName
 * @returns {Object}
 */
module.exports = (obj, erpName) => {
  let erp = ERPS.find(p => p.name.toLowerCase() === erpName.toLowerCase())

  // If we did not find the ERP, let's use SoftClass as default
  if (!erp) {
    erp = ERPS[0]
  }

  // Grab fields
  const { fields } = erp

  const fieldsKeys = Object.keys(fields)
  const fieldsValues = Object.values(fields)

  let product = {}
  Object.keys(obj).forEach(key => {
    if (key && key.length > 0) {
      // Does we support this field?
      const index = fieldsValues.indexOf(key)
      if (index !== -1) {
        const field = fieldsKeys[index]
        product = {
          ...product,
          [field]: obj[key]
        }
      }
    }

  })

  return product
}
