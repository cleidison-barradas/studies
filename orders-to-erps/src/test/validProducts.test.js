const validProducts  = require('../utils/validProducts')

describe('validProducts', () => {
    it('should return only valid products when there are valid and invalid products', () => {
        const products = [
            { EAN: '1234567890' },
            { EAN: '9876543210' },
            { EAN: 'invalid' },
            {},
        ]

        const expectedValidProducts = [
            { EAN: '1234567890' },
            { EAN: '9876543210' },
        ]

        expect(validProducts(products)).toEqual(expectedValidProducts)
    })

    it('should return an empty list when there are no products', () => {
        const products = []

        const expectedValidProducts = []

        expect(validProducts(products)).toEqual(expectedValidProducts)
    })

    it('should return an empty list when all products are invalid', () => {
        const products = [
            { EAN: 'invalid1' },
            { EAN: 'invalid2' },
            { EAN: 'invalid3' },
        ]

        const expectedValidProducts = []

        expect(validProducts(products)).toEqual(expectedValidProducts)
    })
})
