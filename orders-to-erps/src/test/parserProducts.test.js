const parserProducts = require('../utils/parserProducts')

describe('parserProducts', () => {
    it('should correctly parse the products based on the schema', () => {
        const entries = [
            { sku: '123', name: 'Product 1', ean: '1111111111', fullPrice: 9.99 },
            { sku: '456', name: 'Product 2', ean: '2222222222', fullPrice: 19.99 },
            { sku: '789', name: 'Product 3', ean: '3333333333', fullPrice: 29.99 },
        ]

        const expectedParsedProducts = [
            { sku: '123', name: 'Product 1', EAN: '1111111111', price: 9.99 },
            { sku: '456', name: 'Product 2', EAN: '2222222222', price: 19.99 },
            { sku: '789', name: 'Product 3', EAN: '3333333333', price: 29.99 },
        ]

        const parsedProducts = parserProducts(entries)

        expect(parsedProducts).toEqual(expectedParsedProducts)

    })

    it('should return an empty list when there are no entries', () => {
        const entries = []

        const expectedParsedProducts = []

        const parsedProducts = parserProducts(entries)
        expect(parsedProducts).toEqual(expectedParsedProducts)
    })
})
