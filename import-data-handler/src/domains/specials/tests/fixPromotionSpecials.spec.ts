import { ObjectId } from "bson"
import { ISpecials } from "../../../interfaces/specials"
import { fixPromotionSpecials } from "../helpers/fixPromotionSpecials"
import moment from "moment"

let products = null, category = [], classification = [],
    quantityBlock = false, AllChecked = false, date = new Date(),
    typePromotion = null, typeDiscount = null

class Specials {

    specials: ISpecials[]

    constructor() {
        this.specials = [{
            'typePromotion': typePromotion,
            'typeDiscount': typeDiscount,
            'price': 10,
            'discountPercentage': 0,
            'category': category,
            'products': products,
            'classification': classification,
            "date_end": date,
            "date_start": date,
            'AllChecked': AllChecked,
            'quantityBlock': quantityBlock,

        }]
    }
}

let specialsResponse = {}

describe('fix promotion specials product return correct', () => {

    test('specials product promotion equal product', async () => {

        products = ["61afa44968b74e25dce828ba"]
        typePromotion = 'product'
        typeDiscount = 'pricePromotion'
        date = new Date()

        const specials = new Specials

        specialsResponse = {
            typePromotion: 'product',
            typeDiscount: 'pricePromotion', 
            date_start: moment(new Date()).startOf('day').toDate(),
            date_end: moment(new Date()).endOf('day').toDate(),
        }

        const { specialsObjPromotion } = await fixPromotionSpecials(specials.specials)
        expect(specialsObjPromotion).toEqual(specialsResponse)

    })
})

describe('fix promotion specials category return correct', () => {

    test('specials category equal promotion category and AllChecked equal true and quantityBlock true', async () => {

        products = []
        category = [{
            '_id': new ObjectId('61afa44968b74e25dce828ba'),
            'name': "Medicamentos"
        }]
        AllChecked = true
        quantityBlock = true
        typePromotion = 'category'
        typeDiscount = 'pricePromotion'
        date = new Date()

        const specials = new Specials

        specialsResponse = {
            typePromotion: 'category',
            typeDiscount: 'discountPromotion',
            category: [{
                '_id': new ObjectId('61afa44968b74e25dce828ba'),
                'name': "Medicamentos"
            }],
            quantityBlock: true,
            AllChecked: true,
            date_start: moment(new Date()).startOf('day').toDate(),
            date_end: moment(new Date()).endOf('day').toDate(),
        }

        const { specialsObjPromotion } = await fixPromotionSpecials(specials.specials)
        expect(specialsObjPromotion).toEqual(specialsResponse)
    })

    test('specials category equal promotion category and AllChecked equal true and quantityBlock false', async () => {

        AllChecked = true
        quantityBlock = false
        typePromotion = 'category'
        typeDiscount = 'pricePromotion'
        date = new Date()

        const specials = new Specials

        specialsResponse = {
            typePromotion: 'category',
            category: [{
                '_id': new ObjectId('61afa44968b74e25dce828ba'),
                'name': "Medicamentos"
            }],
            typeDiscount: 'discountPromotion',
            AllChecked: true,
            date_start: moment(new Date()).startOf('day').toDate(),
            date_end: moment(new Date()).endOf('day').toDate(),
        }

        const { specialsObjPromotion } = await fixPromotionSpecials(specials.specials)
        expect(specialsObjPromotion).toEqual(specialsResponse)
    })

    test('specials category equal promotion category and AllChecked equal false and quantityBlock true', async () => {

        AllChecked = false
        quantityBlock = true
        typePromotion = 'category'
        typeDiscount = 'pricePromotion'
        date = new Date()

        const specials = new Specials

        specialsResponse = {
            typePromotion: 'category',
            category: [{
                '_id': new ObjectId('61afa44968b74e25dce828ba'),
                'name': "Medicamentos"
            }],
            typeDiscount: 'discountPromotion',
            quantityBlock: true,
            date_start: moment(new Date()).startOf('day').toDate(),
            date_end: moment(new Date()).endOf('day').toDate(),
        }

        const { specialsObjPromotion } = await fixPromotionSpecials(specials.specials)
        expect(specialsObjPromotion).toEqual(specialsResponse)
    })

    test('specials category equal promotion category and AllChecked equal false and quantityBlock false', async () => {

        AllChecked = false
        quantityBlock = false
        typePromotion = 'category'
        typeDiscount = 'pricePromotion'
        date = new Date()

        const specials = new Specials

        specialsResponse = {
            typePromotion: 'category',
            category: [{
                '_id': new ObjectId('61afa44968b74e25dce828ba'),
                'name': "Medicamentos"
            }],
            typeDiscount: 'discountPromotion',
            date_start: moment(new Date()).startOf('day').toDate(),
            date_end: moment(new Date()).endOf('day').toDate(),
        }

        const { specialsObjPromotion } = await fixPromotionSpecials(specials.specials)
        expect(specialsObjPromotion).toEqual(specialsResponse)
    })
})

describe('fix promotion specials classification return correct', () => {

    test('specials classification equal promotion classification and AllChecked equal true and quantityBlock true', async () => {

        category = []
        classification = [{
            '_id': new ObjectId('61afa44968b74e25dce828ba'),
            'name': "ETICO"
        }]
        AllChecked = true
        quantityBlock = true
        typePromotion = 'classification'
        typeDiscount = 'pricePromotion'
        date = new Date()

        const specials = new Specials

        specialsResponse = {
            typePromotion: 'classification',
            classification: [{
                '_id': new ObjectId('61afa44968b74e25dce828ba'),
                'name': "ETICO"
            }],
            typeDiscount: 'discountPromotion',
            quantityBlock: true,
            AllChecked: true,
            date_start: moment(new Date()).startOf('day').toDate(),
            date_end: moment(new Date()).endOf('day').toDate(),
        }

        const { specialsObjPromotion } = await fixPromotionSpecials(specials.specials)
        expect(specialsObjPromotion).toEqual(specialsResponse)
    })

    test('specials category equal promotion classification and AllChecked equal true and quantityBlock false', async () => {

        AllChecked = true
        quantityBlock = false
        typePromotion = 'classification'
        typeDiscount = 'pricePromotion'
        date = new Date()

        const specials = new Specials

        specialsResponse = {
            typePromotion: 'classification',
            classification: [{
                '_id': new ObjectId('61afa44968b74e25dce828ba'),
                'name': "ETICO"
            }],
            typeDiscount: 'discountPromotion',
            AllChecked: true,
            date_start: moment(new Date()).startOf('day').toDate(),
            date_end: moment(new Date()).endOf('day').toDate(),
        }

        const { specialsObjPromotion } = await fixPromotionSpecials(specials.specials)
        expect(specialsObjPromotion).toEqual(specialsResponse)
    })

    test('specials category equal promotion classification and AllChecked equal false and quantityBlock true', async () => {

        AllChecked = false
        quantityBlock = true
        typePromotion = 'classification'
        typeDiscount = 'pricePromotion'
        date = new Date()

        const specials = new Specials

        specialsResponse = {
            typePromotion: 'classification',
            classification: [{
                '_id': new ObjectId('61afa44968b74e25dce828ba'),
                'name': "ETICO"
            }],
            typeDiscount: 'discountPromotion',
            quantityBlock: true,
            date_start: moment(new Date()).startOf('day').toDate(),
            date_end: moment(new Date()).endOf('day').toDate(),
        }

        const { specialsObjPromotion } = await fixPromotionSpecials(specials.specials)
        expect(specialsObjPromotion).toEqual(specialsResponse)
    })

    test('specials category equal promotion classification and AllChecked equal false and quantityBlock false', async () => {

        AllChecked = false
        quantityBlock = false
        typePromotion = 'classification'
        typeDiscount = 'pricePromotion'
        date = new Date()

        const specials = new Specials

        specialsResponse = {
            typePromotion: 'classification',
            classification: [{
                '_id': new ObjectId('61afa44968b74e25dce828ba'),
                'name': "ETICO"
            }],
            typeDiscount: 'discountPromotion',
            date_start: moment(new Date()).startOf('day').toDate(),
            date_end: moment(new Date()).endOf('day').toDate(),
        }

        const { specialsObjPromotion } = await fixPromotionSpecials(specials.specials)
        expect(specialsObjPromotion).toEqual(specialsResponse)
    })
})


