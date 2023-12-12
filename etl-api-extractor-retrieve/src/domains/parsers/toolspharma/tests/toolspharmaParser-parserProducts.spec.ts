
import { type } from 'os'
import { IGetResponse } from '../interfaces/IGetResponse'
import { parserProducts } from '../toolspharmaParser'
let productResponse = []

let price = '0'
let specials = '0'
let discountPercentage = '0'
class Product {

    list: IGetResponse['list']


    constructor() {
        this.list = [{
            'idProduto': '38500',
            'codigoBarras': '7896026300254',
            'produto': 'BEROTEC XPE AD 120 ML',
            'idLaboratorio': '2100',
            'laboratorio': 'BOEHRINGER',
            'idGrupoProduto': '100',
            'grupoProduto': 'ETICO',
            'idSubGrupoProduto': '',
            'subGrupoProduto': '',
            'idCategoria': '',
            'categoria': '',
            'estoque': '0',
            'precoFabrica': '3,36',
            'precoVenda': price,
            'ativo': '1',
            'descontoCadastro': discountPercentage,
            'descontoPromocaoAtiva': specials,
            'quantidadePromocaoPorQuantidadeLimitada': '',
            'descontoPromocaoPorQuantidadeLimitada': '',
            'quantidadePromocaoPorQuantidade': '',
            'descontoPromocaoPorQuantidade': '',
            'valorPMC': '422',
        }]


    }
}


describe('function is working correctly', () => {

    test('parser products from api error', () => {
        const productsData = parserProducts(null)
        expect(productsData instanceof Error)
    })

})

describe('function is working ValorPMC', () => {


    test('specials maior que zero e menor que 99%, maior que discountpercentage', () => {
        price = '10'
        specials = '50'
        discountPercentage = '40'

        const product = new Product

        productResponse = [
            {
                EAN: '7896026300254',
                name: 'BEROTEC XPE AD 120 ML',
                laboratory: 'BOEHRINGER',
                price: 10.00,
                specials: 5.00,
                quantity: 0
            }
        ]
        const productsData = parserProducts(product['list'])
        expect(productsData).toEqual(productResponse)
    })

    test('specials maior que zero e menor que 99%, menor que discountpercentage', () => {
        price = '10'
        specials = '30'
        discountPercentage = '50'
        const product = new Product
        productResponse = [
            {
                EAN: '7896026300254',
                name: 'BEROTEC XPE AD 120 ML',
                laboratory: 'BOEHRINGER',
                price: 10.00,
                specials: 5.00,
                quantity: 0
            }
        ]
        const productsData = parserProducts(product['list'])
        expect(productsData).toEqual(productResponse)
    })

    test('specials maior que zero e maior que 99%, maior que discountpercentage', () => {
        price = '10'
        specials = '100'
        discountPercentage = '50'
        const product = new Product

        productResponse = [
            {
                EAN: '7896026300254',
                name: 'BEROTEC XPE AD 120 ML',
                laboratory: 'BOEHRINGER',
                price: 10.00,
                specials: 5.00,
                quantity: 0
            }
        ]
        const productsData = parserProducts(product['list'])
        expect(productsData).toEqual(productResponse)
    })
    test('discountpercentage maior que zero e maior que 99%', () => {
        price = '10'
        specials = '0'
        discountPercentage = '100'
        const product = new Product

        productResponse = [
            {
                EAN: '7896026300254',
                name: 'BEROTEC XPE AD 120 ML',
                laboratory: 'BOEHRINGER',
                price: 10.00,
                specials: 10.00,
                quantity: 0
            }
        ]
        const productsData = parserProducts(product['list'])
        expect(productsData).toEqual(productResponse)
    })
    test('discountpercentage igual a zero e menor que 99%', () => {
        price = '10'
        specials = '0'
        discountPercentage = '0'
        const product = new Product

        productResponse = [
            {
                EAN: '7896026300254',
                name: 'BEROTEC XPE AD 120 ML',
                laboratory: 'BOEHRINGER',
                price: 10.00,
                specials: 10.00,
                quantity: 0
            }
        ]
        const productsData = parserProducts(product['list'])
        expect(productsData).toEqual(productResponse)
    })
    test('discountpercentage maior a zero e menor que 99%', () => {
        price = '10'
        specials = '0'
        discountPercentage = '50'
        const product = new Product

        productResponse = [
            {
                EAN: '7896026300254',
                name: 'BEROTEC XPE AD 120 ML',
                laboratory: 'BOEHRINGER',
                price: 10.00,
                specials: 5.00,
                quantity: 0,
            }
        ]
        const productsData = parserProducts(product['list'])
        expect(productsData).toEqual(productResponse)
    })

})
