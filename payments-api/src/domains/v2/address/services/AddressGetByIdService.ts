import { Address, AddressRepository } from "@mypharma/api-core"
import { ObjectId } from "bson"
import { IDeliveryMode } from "../../../../interfaces/deliveryMode"
import { AddressServiceRepository } from "../../../../repositories/internals"

interface RequestAddressGetByIdServiceDTO {
  tenant: string
  addressId?: string
  deliveryMode: IDeliveryMode
}

class AddressGetByIdService {

  constructor(private repository?: AddressServiceRepository) { }

  public async findAddressById({ tenant, addressId = null, deliveryMode = 'own_delivery' }: RequestAddressGetByIdServiceDTO) {
    let address: Address | null = null

    if (!addressId) return null

    if (this.repository) {
      address = await this.repository.findOne(addressId)

    } else {

      address = await AddressRepository.repo(tenant).findOne({
        where: {
          _id: new ObjectId(addressId)
        }
      })
    }

    if (deliveryMode !== 'store_pickup' && !address) {

      throw new Error('address_not_found')
    }

    return address
  }
}

export default AddressGetByIdService