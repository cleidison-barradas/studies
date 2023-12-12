import { DeliveryFee } from "@mypharma/api-core";
import { DeliveryFeeServiceRepository } from "../internals";

class FakeDeliverFeeRepository implements DeliveryFeeServiceRepository {
  private deliveryFees: DeliveryFee[] = []

  async findOne(neighborhoodId: string): Promise<DeliveryFee | null> {
    const deliveryFee = this.deliveryFees.find(_delivery => _delivery.neighborhood._id.toString() === neighborhoodId)

    return deliveryFee
  }

  async createDoc(deliveryFee: DeliveryFee): Promise<DeliveryFee> {

    this.deliveryFees.push(deliveryFee)

    return deliveryFee
  }
}

export default FakeDeliverFeeRepository