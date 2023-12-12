import { BaseRepository } from '../../../support/repositories/BaseRepository'
import { UserData } from '../../../support/interfaces/UserData'
import { User } from '../models/base/User'

export class UserRepository<T extends User> extends BaseRepository<T> {
  public async getById(id: number) {
    try {
      return await this.repository.findOne({
        where: {
          userId: id
        }
      })
    } catch {
      return null
    }
  }

  public async create(user: UserData): Promise<User> {
    return await this.repository.save(user as any)
  }
}
export const userRepository = new UserRepository<User>(User)

