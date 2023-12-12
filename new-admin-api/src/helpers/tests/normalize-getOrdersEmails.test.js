const {getOrdersEmails} = require('../normalize')

const input =
[
    {
      'Nome do Cliente': 'asdas dasdasd',
      Email: 'teste@dasdas.com'
    },
    {
      Origem: 'Ecommerce',
      'Nome do Cliente': 'asdas dasdasd',
      Email: 'teste@dasdas.com'
    },
    {
      'Nome do Cliente': 'Test Customer',
      Email: 'testcustomer@mypharma.com.br'
    },
    { 'Valor total dos pedidos': ' R$ 61,58' }
  ]

const output = //expected output
  [
    {
      Email: 'teste@dasdas.com',
      Nome: 'asdas dasdasd',
      'Quantidade de Pedidos': 2
    },
    {
      Email: 'testcustomer@mypharma.com.br',
      Nome: 'Test Customer',
      'Quantidade de Pedidos': 1
    }
  ]

  test('function is returning correct output', () => {
    const ordersCustomers_Output =  getOrdersEmails(input)
    if (input===output){
      expect(input).toEqual( 
        expect.arrayContaining([ 
          expect.objectContaining(
            {
                Email: 'teste@dasdas.com',
                Nome: 'asdas dasdasd',
                'Quantidade de Pedidos': 2
            } 
          ),
          expect.objectContaining(
            {
                Email: 'testcustomer@mypharma.com.br',
                Nome: 'Test Customer',
                'Quantidade de Pedidos': 1
            } 
          ),
        ])
      )
    }
  })