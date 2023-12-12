import { Cart, ObjectID } from "@mypharma/api-core"
import FakeCartRepository from '../../../../repositories/FakeRepository/FakeCartRepository'
import CartGetService from './CartGetService'

describe('Testing cart service', () => {
  const fakeCartRepository = new FakeCartRepository()
  const cartGetService = new CartGetService(fakeCartRepository)
  const tenant = ''
  let mockCart = new Cart()

  beforeAll(async () => {
    mockCart._id = new ObjectID(32) as any
    mockCart.cupom = null
    mockCart.customerId = null
    mockCart.email = 'test@suport.com'
    mockCart.products = [{ quantity: 1, product: null }]

    mockCart = await fakeCartRepository.createDoc(mockCart)
  })

  test('Should be able to find cart by _id', async () => {
    const cartId = mockCart._id.toString()
    const cart = await cartGetService.findCartById({ storeId: '', cartId })

    expect(cart).toBeInstanceOf(Cart)

  })

  test('Should be able not find cart by _id', async () => {
    const cartId = ''

    expect(cartGetService.findCartById({
      storeId: '',
      cartId
    })).rejects.toBeInstanceOf(Error)

  })
})