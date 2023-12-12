import { Repository } from 'typeorm'
import { DBConnection } from '../plugins/db'
import { BaseModel } from '../models/base/BaseModel'

export class BaseRepository<T extends BaseModel> {
  private _repository: Repository<T>

  constructor(
    private model
  ) {}

  public get repository(): Repository<T> {
    if (!this._repository) {
      this._repository = DBConnection.getRepository(this.model)
    }

    return this._repository
  }
}
