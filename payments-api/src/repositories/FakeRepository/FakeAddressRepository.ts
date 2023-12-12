import { Address } from "@mypharma/api-core";
import { AddressServiceRepository } from "../internals";

class FakeAddressRepository implements AddressServiceRepository {
  private addresses: Address[] = []

  async createDoc(address: Address): Promise<Address> {
    this.addresses.push(address)

    return address
  }

  async findOne(id: string): Promise<Address | null> {
    const address = this.addresses.find(_address => _address._id.toString() === id)

    return address
  }
}

export default FakeAddressRepository