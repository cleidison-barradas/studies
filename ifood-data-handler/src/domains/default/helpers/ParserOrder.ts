import { Address, City, CountryState, Customer, DeliveryFee, Neighborhood, Order, ProductRepository, StatusOrderRepository } from "@mypharma/api-core";
import { IFoodProduct, IIFoodClient, IIFoodDeliveryAddress, IIFoodOrderDetail } from "../../../interfaces/ifood.interface";
import { OrderProducts } from "../../../interfaces/order.interface";

const parserProducts = async (items: IFoodProduct[], tenant: string) => {
  const products = await ProductRepository.repo(tenant).find({ where: { EAN: { $in: items.map(i => i.codigoBarra) } } })
  const productsParsed: OrderProducts[] = []

  items.forEach(item => {
    let product = products.find(p => p.EAN.includes(item.codigoBarra))

    if (product) {
      product.price = Number(item.valor)

      productsParsed.push({
        product,
        amount: item.quantidade,
        unitaryValue: item.valor,
        promotionalPrice: item.valor
      })
    }

  })

  return productsParsed
}

const parserAddress = (ifoodAddress: IIFoodDeliveryAddress) => {
  let city = new City()
  let address = new Address()
  let state = new CountryState()
  let neighborhood = new Neighborhood()

  address.postcode = ifoodAddress.cep
  address.street = ifoodAddress.logradouro
  address.number = Number(ifoodAddress.numero)
  neighborhood.name = ifoodAddress.bairro
  city.name = ifoodAddress.cidade
  state.name = ifoodAddress.estado
  state.code = ifoodAddress.uf
  city.state = state
  neighborhood.city = city
  address.neighborhood = neighborhood


  return address
}

const parserCustomer = (client: IIFoodClient) => {

  let customer = new Customer()
  const [firstname, ...lastname] = client.nome.split(' ')
  customer.phone = ''
  customer._id = undefined
  customer.cpf = client.cpf
  customer.email = client.email
  customer.fullName = client.nome
  customer.originalId = client.id
  customer.firstname = firstname || ''
  customer.lastname = lastname ? lastname.toString().replace(/[\W_]+/g, ' ') : ''

  return customer
}

export const parserOrder = async (tenant: string, ifoodOrder: IIFoodOrderDetail, orderId: number) => {
  let order = new Order()
  let deliveryData = new DeliveryFee()
  const { cliente, items, dataHora, enderecoEntrega, valorTotal, valorEntrega, entrega = true } = ifoodOrder

  const statusOrder = await StatusOrderRepository.repo().findOne({ where: { type: 'pending' } })

  order.paymentCode = 'pay_online'
  order.prefix = 'iFood'
  order.paymentMethod = null
  order.cpf = cliente.cpf
  order.originalId = orderId
  order.statusOrder = statusOrder
  order.deliveryMode = entrega ? 'own_delivery' : 'store_pickup'
  order.totalOrder = Number(valorTotal)
  order.customer = parserCustomer(cliente)
  order.products = await parserProducts(items, tenant) as any
  order.deliveryData = null
  order.customer.addresses = []

  if (entrega) {
    order.customer.addresses = [parserAddress(enderecoEntrega)]
    deliveryData.feePrice = Number(valorEntrega)
    deliveryData.freeFrom = 0
    deliveryData.deliveryTime = 0
    deliveryData.minimumPurchase = 0
    deliveryData.neighborhood = order.customer.addresses[0].neighborhood
    order.deliveryData = deliveryData
  }

  order.createdAt = new Date(dataHora)

  return order
}