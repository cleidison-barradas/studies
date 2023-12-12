import { DeliveryFee, DeliveryFeeRepository } from "@mypharma/api-core"
import { DeliveryFeeServiceRepository } from "../../../../repositories/internals"
import { ObjectId } from 'bson'

interface RequestDeliveryGetFeeByNeighborhoodIdServiceDTO {
  tenant: string
  neighborhoodId: string
}

class DeliveryGetFeeByNeighborhoodIdService {
  constructor(private repository?: DeliveryFeeServiceRepository) { }

  public async getDeliveryFeeByNeighborhoodId({ neighborhoodId, tenant }: RequestDeliveryGetFeeByNeighborhoodIdServiceDTO) {
    let deliveryFee = new DeliveryFee()

    if (!this.repository) {

      deliveryFee = await DeliveryFeeRepository.repo(tenant).findOne({
        where: {
          $or: [
            { 'neighborhood._id': neighborhoodId },
            { 'neighborhood._id': new ObjectId(neighborhoodId) }
          ]
        }
      })

    } else {

      deliveryFee = await this.repository.findOne(neighborhoodId)
    }

    if (!deliveryFee) {
      throw new Error('delivery_fee_not_found')
    }

    return deliveryFee
  }
}

export default DeliveryGetFeeByNeighborhoodIdService