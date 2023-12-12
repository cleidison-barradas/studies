/**
 * return only products with price ean price provided
 * 
 * @param {Array} products products to validate
 */

const validProducts = (products) => {
    return products.filter(p =>
        (typeof p.EAN !== 'undefined' && Number(p.EAN) > 0)
    )
}

module.exports = validProducts