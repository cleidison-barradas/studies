import { Address, AddressRepository, BaseModel, CityRepository, Customer, CustomerRepository, Neighborhood, NeighborhoodRepository } from '@mypharma/api-core'
import { ObjectId } from 'bson'
import { normalizeStr } from '../../../../helpers/normalizeStr'
import { ObjectID } from 'mongodb'

export interface CityDTO extends BaseModel {
  name: string
  state: {
    name: string
    code: string
  }
}

export interface NeighborhoodDTO extends BaseModel {
  name: string
  city: CityDTO
  deliverable?: boolean
}

export interface RequestCreateAddressDTO {
  customerId: string
  tenant: string
  address: Address
}

class AddressCreateService {
  putAddress(tenant: string, address: Partial<Address>) {
    return AddressRepository.repo<AddressRepository>(tenant).createDoc(address)
  }

  async findCity(city: CityDTO) {
    return CityRepository.repo().findOne({ where: { name: new RegExp(normalizeStr(city.name), 'gi'), state: new RegExp(normalizeStr(city.state.name), 'gi') } })
  }

  async saveCity(city: CityDTO) {
    return CityRepository.repo().save(city)
  }

  async saveNeighborhood(neighborhood: NeighborhoodDTO) {
    let city = await this.findCity(neighborhood.city)
    if (!city) city = await this.saveCity(neighborhood.city)

    return NeighborhoodRepository.repo().save({
      ...neighborhood,
      city,
    })
  }

  async getNeighborhoodByName(neighborhood: NeighborhoodDTO) {
    const data = await NeighborhoodRepository.repo<NeighborhoodRepository>().find()

    return (
      data.find(
        (value) =>
          normalizeStr(value.name).toLowerCase() === normalizeStr(neighborhood.name).toLowerCase() &&
          normalizeStr(value.city.name).toLowerCase() === normalizeStr(neighborhood.city.name).toLowerCase() &&
          normalizeStr(value.city.state.name).toLowerCase() === normalizeStr(neighborhood.city.state.name).toLowerCase()
      ) || null
    )
  }

  async addCustomerAddress(tenant: string, customer: Customer['_id'], address: any) {
    const Customers = CustomerRepository.repo<CustomerRepository>(tenant)

    const _customer = await Customers.findOne({ _id: new ObjectID(customer as ObjectID) })

    if (!_customer) throw new Error('Customer not found')

    if (!_customer.addresses || _customer.addresses.length === 0) address.isMain = true

    return Customers.updateOne(
      { _id: new ObjectId(customer as ObjectID) },
      {
        $addToSet: {
          addresses: address,
        },
      }
    )
  }

  public async execute({ tenant, address, customerId }: RequestCreateAddressDTO) {
    const { neighborhood } = address

    try {
      const hasAvailableNeighborhood = await this.getNeighborhoodByName(neighborhood)

      const addressNeighborhood = hasAvailableNeighborhood ? hasAvailableNeighborhood : ((await this.saveNeighborhood(neighborhood)) as Neighborhood)

      address.neighborhood = addressNeighborhood

      const newAddress = await this.putAddress(tenant, address)
      await this.addCustomerAddress(tenant, new ObjectID(customerId), newAddress)

      return newAddress
    } catch (error) {
      console.log(error)
      throw new Error(error.message)
    }
  }
}
export default AddressCreateService
