import { ObjectID, User, UserRepository } from '@mypharma/api-core'

interface UserGetByUserIdServiceDTO {
  userId: string
}

class UserGetByUserIdService {

  public async getUserByUserId({ userId }: UserGetByUserIdServiceDTO): Promise<User> {
    let user = new User()

    user = await UserRepository.repo().findById(new ObjectID(userId))

    if (!user) {

      throw new Error('user_not_found')
    }

    return user
  }
}

export default UserGetByUserIdService