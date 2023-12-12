const { specialsParser } = require('../services/specialsParser.js')
const moment = require('moment')

let product = {
    _id: "636d6c265fd66944f7c13751",
    EAN: "78921212121",
    price: 20.00,
},
    typePromotion = 'product',
    typeDiscount = 'pricePromotion',
    price = 10,
    discountPercentage = 0
    date_start = new Date()
    date_end = new Date()

let response = {
    typePromotion:'product',
    typeDiscount:'pricePromotion',
    price: 10,
    date_start: moment(new Date()).startOf('day').toDate(),
    date_end: moment(new Date()).endOf('day').toDate()
}

describe('specials parser correct', () => {

    it('typeDiscount equal to pricePromotion and price greater 0', () => {

        const { specialsObj } = specialsParser({
            product, typePromotion, typeDiscount,
            discountPercentage, price, date_start, date_end
        })
        expect(specialsObj).toEqual(response)
    })

    it('typeDiscount equal to discountPromotion and discountPercentage greater 0 ', () => {

        typePromotion = 'product',
        typeDiscount = 'discountPromotion'
        price = 0
        discountPercentage = 10
        date_start = new Date()
        date_end = new Date()

        response = {
            typePromotion: 'product',
            typeDiscount:'discountPromotion',
            price: 18,
            discountPercentage: 10,
            date_start: moment(new Date()).startOf('day').toDate(),
            date_end: moment(new Date()).endOf('day').toDate()
        }

        const { specialsObj } = specialsParser({
            product, typePromotion, typeDiscount,
            discountPercentage, price, date_start, date_end
        })
        expect(specialsObj).toEqual(response)
    })

})