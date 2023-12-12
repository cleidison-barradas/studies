
/**
 * 
 * @param {Object} req 
 * @param {Object} req.product
 * @param {Array} req.specials
 * @returns 
 */

 function bulkWriteSpecials({ product, specials }) {

    const bulkWriteProductParser = []
    const bulkWriteShowCaseParser = []

    bulkWriteProductParser.push({
        updateOne: {
            filter: { EAN: product.EAN },
            update: {
                '$set': { specials }
            },
            upsert: true,
        }
    })

    bulkWriteShowCaseParser.push({
        updateMany: {
            filter: {
                products: {
                    $elemMatch: {
                        'product.EAN': product.EAN
                    }
                }
            },
            update: {
                '$set': {
                    'products.$.product.specials': specials,
                    updateAt: new Date()
                }
            },
            multi: true
        }
    })
    return { bulkWriteProductParser, bulkWriteShowCaseParser }
}

module.exports = { bulkWriteSpecials }