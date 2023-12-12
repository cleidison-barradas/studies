const { parseProducts } = require('../TrierService.js')

describe('parseProducts', () => {
    test('returns parsed products with promotional price', () => {
        const products = [
            {
                product: {
                    sku: '12345',
                    name: 'Product A',
                },
                amount: 2,
                unitaryValue: 10.00,
                promotionalPrice: 8.50,
            },
            {
                product: {
                    sku: '67890',
                    name: 'Product B',
                },
                amount: 1,
                unitaryValue: 5.00,
                promotionalPrice: 4.00,
            },
        ]
        const parsedProducts = parseProducts(products)
        expect(parsedProducts).toEqual([
            {
                codigoProduto: 12345,
                nomeProduto: 'Product A',
                quantidade: 2,
                valorUnitario: 8.50,
                valorDesconto: 0.00,
            },
            {
                codigoProduto: 67890,
                nomeProduto: 'Product B',
                quantidade: 1,
                valorUnitario: 4.00,
                valorDesconto: 0.00,
            },
        ])
    })

    test('returns parsed products without promotional price', () => {
        const products = [
            {
                product: {
                    sku: '12345',
                    name: 'Product A',
                },
                amount: 2,
                unitaryValue: 10.00,
                promotionalPrice: null,
            },
            {
                product: {
                    sku: '67890',
                    name: 'Product B',
                },
                amount: 1,
                unitaryValue: 5.00,
                promotionalPrice: null,
            },
        ]
        const parsedProducts = parseProducts(products)
        expect(parsedProducts).toEqual([
            {
                codigoProduto: 12345,
                nomeProduto: 'Product A',
                quantidade: 2,
                valorUnitario: 10.00,
                valorDesconto: 0.00,
            },
            {
                codigoProduto: 67890,
                nomeProduto: 'Product B',
                quantidade: 1,
                valorUnitario: 5.00,
                valorDesconto: 0.00,
            },
        ])
    })

    test('returns empty array for empty products', () => {
        const products = []
        const parsedProducts = parseProducts(products)
        expect(parsedProducts).toEqual([])
    })
})