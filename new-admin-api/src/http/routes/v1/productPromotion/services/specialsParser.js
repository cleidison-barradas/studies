const moment = require('moment')
/**
 * 
 * @param {Object} req 
 * @param {String} req.typePromotion
 * @param {String} req.typeDiscount
 * @param {Number} req.price
 * @param {Number} req.discountPercentage
 * @param {Date} req.date_start
 * @param {Date} req.date_end
 * @param {Object} req.product
 * 
 * @returns 
 */

function specialsParser({ product, typePromotion, typeDiscount,
    discountPercentage, price, date_start, date_end }) {

    let specialsObj = {}

    specialsObj['typePromotion'] = typePromotion
    specialsObj['typeDiscount'] = typeDiscount

    if (typeDiscount === 'pricePromotion' && price > 0) {
        specialsObj['price'] = Number(price)
    }

    if (typeDiscount === 'discountPromotion' && discountPercentage > 0) {
        specialsObj['price'] = Number((Number(product.price) - (Number(product.price) * (Number(discountPercentage) / 100))).toFixed(2))
        specialsObj['discountPercentage'] = Number(discountPercentage)
    }

    specialsObj['date_start'] = moment(new Date(date_start)).startOf('day').toDate()
    specialsObj['date_end'] = moment(new Date(date_end)).endOf('day').toDate()

    return { specialsObj }
}

module.exports = { specialsParser }