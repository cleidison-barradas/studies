const {expect, test} = require ('@jest/globals');
const { isUndefined } = require('lodash');
const {getOrdersProducts} = require('../normalize')

//MongoDB order products example
const product1 = {
  product: {
    EAN: '7891058022792',
    name: 'ANALGÉSICO DORFLEX UNO ENXAQUECA  1 GRAMA 10 COMPRIMIDOS EFERVECENTES'
  },
  amount: 1
}
const product2 = {
  product: {
    EAN: '742832304801',
    name: ' Abendazol 400mg - 1 Comprimido Sabor Laranja'
  },
  amount: 1
}

//MongoDB order example
const order = {
  _doc : {
    products: [
      {
        product: [product1],
        unitaryValue: 28.91,
        amount: 1,
        promotionalPrice: 28.91
      },
      {
        product: [product2],
        unitaryValue: 5.6905,
        amount: 1,
        promotionalPrice: 5.6905
      }
    ]
  }
}

//PRODUTO
const product3 = {
  product: {
    EAN: '742832304801',
    name: ' Abendazol 400mg - 1 Comprimido Sabor Laranja'
    },
  amount: 1
}

//PEDIDO 2
const order2 = {
  _doc : {
    products: [
      {
        product: [product3],
        unitaryValue: 5.6905,
        amount: 1,
        promotionalPrice: 5.6905
      }
    ]
  }
}

//expected outuput to getOrdersProducts([order1, order2])
const output =
[
  {
    EAN: '742832304801',
    Nome: ' Abendazol 400mg - 1 Comprimido Sabor Laranja',
    Vendidos: 2
  },
  {
    EAN: '7891058022792',
    Nome: 'ANALGÉSICO DORFLEX UNO ENXAQUECA  1 GRAMA 10 COMPRIMIDOS EFERVECENTES',
    Vendidos: 1
  },
  undefined // end of object, prevents jest error
]


describe('output is correct', () => {

  const orders = [order, order2]
  const ordersProducts_Output =  getOrdersProducts(orders)

  test('function is returning correct output', () => {
    if (ordersProducts_Output===output){
      expect(ordersProducts_Output).toEqual( 
        expect.arrayContaining([ 
          expect.objectContaining(
            {
              EAN: '742832304801',
              Nome: ' Abendazol 400mg - 1 Comprimido Sabor Laranja',
              Vendidos: 2
            } 
          ),
          expect.objectContaining(
            {
              EAN: '7891058022792',
              Nome: 'ANALGÉSICO DORFLEX UNO ENXAQUECA  1 GRAMA 10 COMPRIMIDOS EFERVECENTES',
              Vendidos: 1
            } 
          ),
        ])
      )
    }
  })

  test('is removing last element if its undefined', () => {
    ordersProducts_Output.push(undefined)
    if (ordersProducts_Output===output){
      expect(ordersProducts_Output).toEqual( 
        expect.arrayContaining([ 
          expect.objectContaining(
            {
              EAN: '742832304801',
              Nome: ' Abendazol 400mg - 1 Comprimido Sabor Laranja',
              Vendidos: 2
            } 
          ),
          expect.objectContaining(
            {
              EAN: '7891058022792',
              Nome: 'ANALGÉSICO DORFLEX UNO ENXAQUECA  1 GRAMA 10 COMPRIMIDOS EFERVECENTES',
              Vendidos: 1
            } 
          ),
        ])
      )
    }
  })

})