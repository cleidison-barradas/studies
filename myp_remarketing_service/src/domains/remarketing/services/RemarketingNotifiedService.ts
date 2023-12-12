import { RemarketingRepository } from "@mypharma/api-core"
import { ObjectId } from "bson"

export type NotificationTypes = 'RECENT-CART' | 'MISS-YOU' | 'NOTIFICATION'

interface RemarketingNotifiedServiceDTO {
  interval: number,
  customerId: string
  type: NotificationTypes
}

class RemarketingNotifiedService {
  constructor(private repository?: any) { }

  public async getHasNotified({ type = 'RECENT-CART', interval, customerId }: RemarketingNotifiedServiceDTO) {
    let count = 0

    if (!this.repository) {

      count = await RemarketingRepository.repo().count({
        type,
        interval,
        'customer._id': new ObjectId(customerId)
      })
    }

    if (count > 0) return true

    return false
  }
}

export default RemarketingNotifiedService