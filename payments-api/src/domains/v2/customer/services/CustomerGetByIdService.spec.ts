import { Customer, ObjectID } from "@mypharma/api-core"
import FakeCustomerRepository from '../../../../repositories/FakeRepository/FakeCustomerRepository'
import CustomerGetByIdService from './CustomerGetByIdService'

describe('Testing customer service', () => {
  const tenant = ''
  let mockCustomer = new Customer()
  const fakeCustomerRepository = new FakeCustomerRepository()
  const customerGetByIdService = new CustomerGetByIdService(fakeCustomerRepository)

  beforeAll(async () => {
    mockCustomer._id = new ObjectID(32) as any
    mockCustomer.firstname = 'client'
    mockCustomer.lastname = 'test'
    mockCustomer.fullName = 'client test'
    mockCustomer.email = 'clien@test.com'
    mockCustomer.createdAt = new Date()

    mockCustomer = await fakeCustomerRepository.createDoc(mockCustomer)
  })

  test('Should be able to find customer by _id', async () => {
    const customerId = mockCustomer._id.toString()
    const customer = await customerGetByIdService.findCustomerById({ tenant, customerId })

    expect(customer).toBeInstanceOf(Customer)

  })

  test('Should be able not find customer by _id', async () => {
    const customerId = ''

    expect(customerGetByIdService.findCustomerById({
      tenant,
      customerId
    })).rejects.toBeInstanceOf(Error)
  })

})