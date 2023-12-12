import { Cart, ObjectID } from "@mypharma/api-core"
import FakeCartRepository from "../../../../repositories/FakeRepository/FakeCartRepository"
import CartUpdateService from "./CartUpdateService"

describe('Testing update cart service', () => {
  let cart = new Cart()
  const fakeCartRepository = new FakeCartRepository()
  const cartUpdateService = new CartUpdateService(fakeCartRepository)

  beforeAll(async () => {
    cart._id = new ObjectID()
    cart.cupom = null
    cart.customerId = null
    cart.storeId = '123456789'
    cart.email = 'test@suport.com'
    cart.products = [{ quantity: 1, product: null }]

    cart = await fakeCartRepository.createDoc(cart)

  })

  test('Should be able update cart', async () => {

    cart.email = 'another@test.com'
    cart = await cartUpdateService.execute({ cart, storeId: '123456789', cartId: '' })

    expect(cart.email).toEqual('another@test.com')
  })
})