import { Store, User, UserRepository, ObjectID } from '@mypharma/api-core'
import { DeleteWriteOpResultObject, FindManyOptions, ObjectLiteral, UpdateWriteOpResult } from 'typeorm'
import { IGetUserRequest } from './interfaces/user.request'
const { DATABASE_MASTER_NAME } = process.env
import sha1 from 'js-sha1'

export default class UserService {
  async getUsers({ query = '', startDate, endDate, limit = 20, page = 1 }: IGetUserRequest): Promise<User[]> {
    const where: ObjectLiteral = {userName: new RegExp(query, 'gi')}

    if (startDate && endDate) {
      where['createdAt'] = { $gte: new Date(startDate), $lte: new Date(endDate) }
    }

    const optionsOrConditions: FindManyOptions<User> = {
      where,
      take: Number(limit),
      skip: Number(limit) * (Number(page) - 1),
    }
    return UserRepository.repo(DATABASE_MASTER_NAME).find(optionsOrConditions)
  }

  async getUsersById(_id: User['_id'][]): Promise<User[]> {
    return UserRepository.repo(DATABASE_MASTER_NAME).findByIds(_id)
  }

  async getUserDetail(id: string | ObjectID): Promise<User> {
    return UserRepository.repo(DATABASE_MASTER_NAME).findById(id)
  }

  async countUser({ query = '', startDate, endDate }: IGetUserRequest): Promise<number> {
    const optionsOrConditions: ObjectLiteral = { $or: [{ username: new RegExp(query, 'gi'), email: new RegExp(query, 'gi') }] }

    if (startDate && endDate) {
      optionsOrConditions['createdAt'] = { $gte: new Date(startDate), $lte: new Date(endDate) }
    }

    return UserRepository.repo(DATABASE_MASTER_NAME).count(optionsOrConditions)
  }

  async addStoreToUsers(_id: User['_id'][], store: Store): Promise<unknown> {
    return UserRepository.repo(DATABASE_MASTER_NAME).updateMany(
      {
        _id: { $in: _id.map((id) => new ObjectID(id.toString())) },
      },
      { $addToSet: { store: new ObjectID(store._id.toString()) } }
    )
  }

  async createUser(user: Partial<User>): Promise<User> {
    // encrypt password
    const salt = Math.random().toString(36).substring(7)
    const encryptedPassword = sha1(salt + sha1(salt + sha1(user.password)))
    user.password = encryptedPassword
    user.createdAt = new Date()
    user.updatedAt = new Date()
    user.salt = salt

    return UserRepository.repo(DATABASE_MASTER_NAME).createDoc(user)
  }

  async softDelete(id: string): Promise<DeleteWriteOpResultObject> {
    return UserRepository.repo(DATABASE_MASTER_NAME).deleteOne({ _id: new ObjectID(id) })
  }

  async updateUser(user: Partial<User>): Promise<UpdateWriteOpResult> {
    const userExists = await UserRepository.repo(DATABASE_MASTER_NAME).findOne({ userName: user.userName })

    if (userExists.password !== user.password) {
      const salt = Math.random().toString(36).substring(7)
      const encryptedPassword = sha1(salt + sha1(salt + sha1(user.password)))
      user.password = encryptedPassword
      user.salt = salt
    }

    user.updatedAt = new Date()
    return UserRepository.repo(DATABASE_MASTER_NAME).updateOne({ userName: user.userName }, { $set: user })
  }

  async validateUser(userName: string): Promise<number> {
    return UserRepository.repo(DATABASE_MASTER_NAME).count({ userName })
  }
}
