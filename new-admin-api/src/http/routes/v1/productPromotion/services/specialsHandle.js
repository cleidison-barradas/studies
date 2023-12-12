
/**
 * 
 * @param {Object} req 
 * @param {String} req.typePromotion
 * @param {String} req.typeDiscount
 * @param {Array} req.products
 * @param {Array} req.category
 * @param {Array} req.classification
 * @param {Number} req.price
 * @param {Boolean} req.AllChecked
 * @param {Boolean} req.quantityBlock
 * @param {Number} req.discountPercentage
 * @param {Date} req.date_start
 * @param {Date} req.date_end
 * 
 * @returns 
 */
function handleSpecials({ typePromotion, typeDiscount, products, category, classification, price,
    discountPercentage, AllChecked, quantityBlock, date_start, date_end }) {

    let specialsObj = {}
    let ids = []
    if (products && products.length > 0) {
        ids = products
    }

    if (category && category.length > 0) {
        ids = category.map(cat => cat._id)
    }

    if (classification && classification.length > 0) {
        ids = classification.map(clas => clas._id)
    }

    
    specialsObj['typePromotion'] = typePromotion
    specialsObj['typeDiscount'] = typeDiscount
    specialsObj['classification'] = classification
    specialsObj['category'] = category
    specialsObj['products'] = products
    specialsObj['price'] = price
    specialsObj['discountPercentage'] = discountPercentage
    specialsObj['quantityBlock'] = quantityBlock
    specialsObj['AllChecked'] = AllChecked
    specialsObj['date_start'] = date_start
    specialsObj['date_end'] = date_end

    return { ids, specialsObj }
}
module.exports = { handleSpecials }