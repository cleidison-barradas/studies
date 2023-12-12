import { BaseRepository } from '../../../support/repositories/BaseRepository'
import { Search } from '../models/base/Search'

export class SearchRepository<T extends Search> extends BaseRepository<T> {
  public async getByFingerprint(fingerprint: string) {
    try {
      return await this.repository.findOne({
        where: {
          fingerprint
        }
      })
    } catch {
      return null
    }
  }
}
export const searchRepository = new SearchRepository<Search>(Search)
