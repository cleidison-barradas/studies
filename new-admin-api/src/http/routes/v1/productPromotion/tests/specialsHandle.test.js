const { handleSpecials } = require('../services/specialsHandle.js')


let typePromotion = 'product', typeDiscount = 'discountPromotion', products = ['636d6c265fd66944f7c13753'],
    classification = [], category = [], date_start = new Date(), date_end = new Date(),
    AllChecked = true, quantityBlock = true, discountPercentage = 20.00, price = 0


let response = {
    typePromotion: 'product',
    typeDiscount: 'discountPromotion',
    AllChecked: true,
    quantityBlock: true,
    category: [],
    classification: [],
    products: ['636d6c265fd66944f7c13753'],
    price: 0,
    discountPercentage: 20.00,
    date_start: new Date(),
    date_end: new Date()
}

let idsResponse = ['636d6c265fd66944f7c13753']

describe('verify typePromotion', () => {

    it('typePromotion equal to product ', () => {

        const { ids, specialsObj } = handleSpecials({
            typePromotion, typeDiscount, products, category, classification, price,
            discountPercentage, AllChecked, quantityBlock, date_start, date_end
        })

        expect(specialsObj).toEqual(response)
        expect(ids).toEqual(idsResponse)
    })

    it('typePromotion equal to category', () => {

        products = [],
            category = [
                {
                    _id: '636d6c265fd66944f7c13751',
                    name: 'Medicamentos'
                }
            ]

        let response = {
            typePromotion: 'product',
            typeDiscount: 'discountPromotion',
            AllChecked: true,
            quantityBlock: true,
            category: [
                {
                    _id: '636d6c265fd66944f7c13751',
                    name: 'Medicamentos'
                }
            ],
            classification: [],
            products: [],
            price: 0,
            discountPercentage: 20.00,
            date_start: new Date(),
            date_end: new Date()
        }
        date_start = new Date()
        date_end = new Date()
        idsResponse = ['636d6c265fd66944f7c13751']
        const { ids, specialsObj } = handleSpecials({
            typePromotion, typeDiscount, products, category, classification, price,
            discountPercentage, AllChecked, quantityBlock, date_start, date_end
        })
        expect(specialsObj).toEqual(response)
        expect(ids).toEqual(idsResponse)
    })

    it('typePromotion equal to classification', () => {

        products = []
        category = [],
            classification = [
                {
                    _id: '636d6c265fd66944f7c13756',
                    name: 'ETICO'
                }
            ]

        let response = {
            typePromotion: 'product',
            typeDiscount: 'discountPromotion',
            AllChecked: true,
            quantityBlock: true,
            category: [],
            products: [],
            classification: [
                {
                    _id: '636d6c265fd66944f7c13756',
                    name: 'ETICO'
                }
            ],
            price: 0,
            discountPercentage: 20.00,
            date_start: new Date(),
            date_end: new Date()
        }
        date_start = new Date()
        date_end = new Date()
        idsResponse = ['636d6c265fd66944f7c13756']
        const { ids, specialsObj } = handleSpecials({
            typePromotion, typeDiscount, products, category, classification, price,
            discountPercentage, AllChecked, quantityBlock, date_start, date_end
        })

        expect(specialsObj).toEqual(response)
        expect(ids).toEqual(idsResponse)
    })
})