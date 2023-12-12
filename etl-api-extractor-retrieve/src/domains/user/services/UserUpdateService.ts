import { IntegrationUserErpRepository } from '@mypharma/api-core'
import { ObjectId } from 'bson'
import databaseConfig from '../../../config/database'

interface RequestUpdateUserServiceDTO {
  userId: string
  lastSeen: Date
}

class UserUpdateService {

  public async execute({ userId, lastSeen = new Date() }: RequestUpdateUserServiceDTO) {
    const _id = new ObjectId(userId)

    return IntegrationUserErpRepository.repo(databaseConfig.name).updateOne(
      { _id },
      {
        $set:
          { lastSeen, updateAt: new Date() }
      })
  }
}

export default UserUpdateService