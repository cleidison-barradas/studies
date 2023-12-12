import { ObjectId } from 'bson'
import { ISpecials } from '../../../interfaces/specials'
import { fixDiscountSpecials } from '../helpers/fixDiscountSpecials'

let price = 10
let discountPercentage = 0
let typeDiscount = null
class Specials {

    entry: ISpecials
    product: any

    constructor() {
        this.entry = {
            'typePromotion': 'product',
            'typeDiscount': typeDiscount,
            'price': price,
            'discountPercentage': discountPercentage,
            'AllChecked': false,
            'category': [],
            'classification': [],
            'products': [],
            'quantityBlock': false,
            'date_start': new Date(),
            'date_end': new Date()
        }
        this.product = {
            '_id': new ObjectId('61afa44968b74e25dce828ba'),
            'EAN': "7899182313213",
            'name': 'aspirina',
            'price': 20
        }
    }
}
let specialsResponse = {}

describe('typeDiscount is correct ', () => {

    test('typeDiscount equal to pricePromotion and price greater 0', () => {
        typeDiscount = 'pricePromotion'
        const specials = new Specials
        specialsResponse = {
            price: 10
        }
        const { specialsObjDiscount } = fixDiscountSpecials(specials.product, specials.entry)
        expect(specialsObjDiscount).toEqual(specialsResponse)
    })

    test('typeDiscount equal to discountPromotion and discountPercentage greater 0', () => {

        price = 0
        discountPercentage = 25.00
        typeDiscount = 'discountPromotion'
        const specials = new Specials
        
        specialsResponse = {
            price: 15.00,
            discountPercentage: 25.00 
        }

        const { specialsObjDiscount } = fixDiscountSpecials(specials.product, specials.entry)
        expect(specialsObjDiscount).toEqual(specialsResponse)
    })
})