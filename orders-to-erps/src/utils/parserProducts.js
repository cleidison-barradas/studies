const productSchema = {
    MS: 'ms',
    sku: 'sku',
    EAN: 'ean',
    name: 'name',
    erp_pmc: 'pmc',
    price: 'fullPrice',
    presentation: 'resume',
    quantity: 'filialStorage',
    manufacturer: 'laboratory',
    specials: 'discountedPrice',
    activePrinciple: 'activePrinciple',
}

const fieldConversion = {
    discountedPrice: 'number',
    fullPrice: 'number',
    pmc: 'number',
    filialStorage: 'integer',
    ean: 'string',
    name: 'string',
    resume: 'string',
    activePrinciple: 'string',
    sku: 'string',
    ms: 'integer'
}

const parseField = (key, value) => {
    const conversion = fieldConversion[key]
    if (conversion === 'number') {
        let numericValue = value

        if (typeof value === 'string') {
            numericValue = value.replace(',', '.')
        }
        return parseFloat(Number(numericValue).toFixed(2))

    } else if (conversion === 'integer') {
        return parseInt(value)
    } else if (conversion === 'string') {
        return String(value)
    }
    return value
}

const parserProducts = (entries) => {
    if (entries.length === 0) return []

    const schemaKeys = Object.keys(productSchema)
    const schemaValues = Object.values(productSchema)

    const parsed = entries.map((product) => {
        const parsedProduct = {}
        for (const key in product) {
            const index = schemaValues.indexOf(key)

            if (index !== -1) {

                const field = schemaKeys[index]
                if (field) {
                    parsedProduct[field] = parseField(key, product[key])
                }
            }
        }

        return parsedProduct
    })

    return parsed
}

module.exports = parserProducts
