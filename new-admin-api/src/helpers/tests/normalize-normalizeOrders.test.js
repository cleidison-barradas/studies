const {normalizeOrders} = require('../normalize')

const _product = {
    product: {
      EAN: '7897595900029',
      name: 'A A S Inf  c/30 cpr',
      quantity: 5
    },
    unitaryValue: 21.29,
    amount: 1
  }


const input = [
    {
     _doc :
     {
        deliveryMode: 'store_pickup',
        deleted: false,
        _id: '6348749f4c775a7c2e6c9bb3',
        products: [ [_product] ],
        customer: {
            fullName: 'Matheus Nunes',
            email: 'nunes.matheus.ismael@gmail.com'
        },
        statusOrder: {
            _id: '60c376fc6473a35847f13853',
            createdAt: '2021-06-11T14:45:16.114Z',
            updatedAt: '2021-06-11T14:45:16.114Z',
            name: 'Pendente',
            type: 'pending'
        },
        deliveryData: null,
        shippingOrder: null,
        totalOrder: 21.29,
        createdAt: '2022-10-13T20:27:11.226Z'
     }
    }
  ]

output=
    [
    {
      "Origem": " ",
      "ID do pedido": " ",
      "Nome do Cliente": " ",
      "Email": " ",
      "Status do pedido": " ",
      "Data do pedido": " ",
      "Cupom": " ",
      "Valor total dos pedidos": "Pendentes: R$ 21,29"
    },
    {
      "Origem": " ",
      "ID do pedido": " ",
      "Nome do Cliente": " ",
      "Email": " ",
      "Status do pedido": " ",
      "Data do pedido": " ",
      "Cupom": " ",
      "Valor total dos pedidos": "Aceitos: R$ 0,00"
    },
    {
      "Origem": " ",
      "ID do pedido": " ",
      "Nome do Cliente": " ",
      "Email": " ",
      "Status do pedido": " ",
      "Data do pedido": " ",
      "Cupom": " ",
      "Valor total dos pedidos": "Rejeitados: R$ 0,00"
    },
    {
      "Origem": " ",
      "ID do pedido": " ",
      "Nome do Cliente": " ",
      "Email": " ",
      "Status do pedido": " ",
      "Data do pedido": " ",
      "Cupom": " ",
      "Valor total dos pedidos": "Entregues: R$ 0,00"
    },
    {
      "Origem": " ",
      "ID do pedido": " ",
      "Nome do Cliente": " ",
      "Email": " ",
      "Status do pedido": " ",
      "Data do pedido": " ",
      "Cupom": " ",
      "Valor total dos pedidos": "Estornados: R$ 0,00"
    },
    {
      "Origem": " ",
      "ID do pedido": " ",
      "Nome do Cliente": " ",
      "Email": " ",
      "Status do pedido": " ",
      "Data do pedido": " ",
      "Cupom": " ",
      "Valor total dos pedidos": "Saíram para entrega: R$ 0,00"
    },
    {
      "Origem": " ",
      "ID do pedido": " ",
      "Nome do Cliente": " ",
      "Email": " ",
      "Status do pedido": " ",
      "Data do pedido": " ",
      "Cupom": " ",
      "Valor total dos pedidos": "Pagamento realizado: R$ 0,00"
    },
    {
      "Origem": " ",
      "ID do pedido": " ",
      "Nome do Cliente": " ",
      "Email": " ",
      "Status do pedido": " ",
      "Data do pedido": " ",
      "Cupom": " ",
      "Valor total dos pedidos": "Aguardando: R$ 0,00"
    },
    {
      "Origem": " ",
      "ID do pedido": " ",
      "Nome do Cliente": " ",
      "Email": " ",
      "Status do pedido": " ",
      "Data do pedido": " ",
      "Cupom": " ",
      "Valor total dos pedidos": "Total: R$ 21,29"
    },
    {
      deliveryMode: 'store_pickup',
      deleted: false,
      _id: '6348749f4c775a7c2e6c9bb3',
      products: [ [_product] ],
      customer: 'Matheus Nunes',
      statusOrder: {
        _id: '60c376fc6473a35847f13853',
        originalId: 1,
        createdAt: '2021-06-11T14:45:16.114Z',
        updatedAt: '2021-06-11T14:45:16.114Z',
        name: 'Pendente',
        type: 'pending'
      },
      deliveryData: null,
      shippingOrder: null,
      totalOrder: 'R$ 21,29',
      createdAt: '13/10/2022',
      email: 'nunes.matheus.ismael@gmail.com',
      status: 'Pendente',
      prefix: 'Ecommerce',
      cupom: 'Não Utilizou'
    }
  ]

  test('function is returning correct output', () => {
    const normalizedOrders =  normalizeOrders(input)
    if (normalizedOrders===output){
      expect(normalizedOrders).toEqual(output)
    }
})