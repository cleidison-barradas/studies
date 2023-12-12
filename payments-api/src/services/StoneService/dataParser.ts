import { Customer, Order, ORM, Store, Product } from '@mypharma/api-core'
import { StoreRequest } from './interfaces'

function orderParser(order: Order, store: Store, cpf: string, stone_card?: string, installment?: number) {
  
  const { customer } = order
  const statement_name = store.tenant
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .substring(0, 21)

  const parsedCustomer = parseCustomer(customer, cpf)
  const parsedShipping = parseShipping(customer, order, store.originalId)
  const parsedItems = parseItems(order)
  const parsedPayments = parsePayments(order.paymentMethod, customer, stone_card, installment, statement_name)

  const stoneOrder = {
    customer: parsedCustomer,
    items: parsedItems,
    shipping: parsedShipping,
    antifraud_enabled: true,
    device: {
      platform: order.userAgent ? order.userAgent : 'Android',
    },
    payments: parsedPayments,
  }
  return stoneOrder
}

function parseCustomer(customer: Customer, cpf: string) {
  const { numero, rua, bairro, zip_code, city, state, country } = parseAddress(customer.addresses[0])
  return {
    name: customer.fullName || 'Nome não informado',
    email: customer.email || 'Email não informado',
    document: cpf ? cpf.replace(/[.-]/g, '') : '12345678900',
    document_type: 'CPF',
    type: 'individual',
    address: {
      country: country || 'BR',
      state: state || 'State',
      city: city || 'City',
      zip_code: zip_code || '123',
      line_1: `${numero},${rua},${bairro}` || '123,rua,bairro',
    },
    phones: {
      mobile_phone: {
        country_code: '55',
        number: customer.phone.replace(/[^0-9]/g, '').substring(2, 11) || '936188832',
        area_code: customer.phone.replace(/[^0-9]/g, '').substring(0, 2),
      },
    },
  }
}

function parseShipping(customer: Customer, order: Order, originalId: number) {
  const { numero, rua, bairro, zip_code, city, state, country } = parseAddress(customer.addresses[0])
  const shipping = order.orderTotals.find((x) => x.code === 'shipping').value || 0
 
  /**
 * Atenção, aqui pegamos pelo originalId por conta de um
 * problema que acontecia se pegássemos pelo statement.
 * Então, cuidar para não remover essa informação.
 */
 
  return {
    amount: Math.floor(Number(shipping) * 100),
    description: String(originalId),
    recipient_name: customer.fullName,
    recipient_phone: customer.phone.replace(/[^0-9]/g, ''),
    address: {
      line_1: `${numero},${rua},${bairro}` || '123,rua,bairro',
      zip_code: zip_code || '123',
      city: city || 'City',
      state: state || 'State',
      country: country || 'BR',
    },
  }
}

function parseItems(order: Order) {
  const items = order.products
  let parsedItems = []
  for (let item of items) {
    const price = item.promotionalPrice ? Math.floor(Number(item.promotionalPrice) * 100) : Math.floor(Number(item.unitaryValue) * 100)

    let i = {
      amount: price || 100,
      description: item.product.model ? item.product.model : 'Description',
      quantity: item.amount ? Number(item.amount) : 1,
    }

    parsedItems.push(i)
  }
  return parsedItems
}

function parsePayments(payMeth, customer, stone_card, installment, statement_name) {
  const { numero, rua, bairro, zip_code, city, state, country } = parseAddress(customer.addresses[0])
  if (payMeth.paymentOption.name === 'Stone') {
    return [
      {
        payment_method: 'credit_card',
        credit_card: {
          recurrence: false,
          operation_type: 'auth_and_capture',
          installments: Number(installment),
          statement_descriptor: statement_name,
          card: {
            token: stone_card,
            billing_address: {
              line_1: `${numero},${rua},${bairro}` || '123,rua,bairro',
              zip_code: zip_code || '123',
              city: city || 'City',
              state: state || 'State',
              country: country || 'BR',
            },
          },
        },
      },
    ]
  }
  if (payMeth.paymentOption.name === 'Boleto') {
    const data = new Date()
    data.setDate(data.getDate() + 3)
    return [
      {
        payment_method: 'boleto',
        boleto: {
          bank: '237',
          instructions: 'Pagar até vencimento',
          due_at: data,
          type: 'DM',
        },
      },
    ]
  }
  if (payMeth.paymentOption.name === 'Stone Pix') {
    return 'Stone Pix'
  }
}

function parseAddress(address) {
  const addressParsed = {
    numero: address.number ? address.number.replace(/\,/g, '') : 123,
    rua: address.street.replace(/\,/g, '') || 'Street',
    bairro: address.neighborhood.name.replace(/\,/g, '') || 'Bairro',
    zip_code: address.postcode.replace(/\,/g, '') || '123',
    city: address.neighborhood.city.name.replace(/\,/g, '') || 'City',
    state: address.neighborhood.city.state.code.replace(/\,/g, '') || 'State',
    country: 'BR',
  }
  return addressParsed
}

export { orderParser }
