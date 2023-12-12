import { RemarketingRepository } from '@mypharma/api-core'
import { ObjectId } from 'bson'

interface RemarketingDeleteServiceDTO {
  storeId: string
  customerId: string
}

class RemarketingDeleteService {
  constructor(private repository?: any) { }

  public async remarketingDeleteTaskService({ storeId, customerId }: RemarketingDeleteServiceDTO) {

    if (!this.repository) {

      return RemarketingRepository.repo().deleteMany(
        {
          'store.storeId': new ObjectId(storeId),
          'customer._id': new ObjectId(customerId)
        }
      )
    }
  }
}

export default RemarketingDeleteService
