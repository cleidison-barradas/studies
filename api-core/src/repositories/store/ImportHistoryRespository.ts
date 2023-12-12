import { BaseRepository } from '../base/BaseRepository'
import { ImportHistory } from '../../models/store/ImportHistory'
import { EntityRepository } from 'typeorm'

@EntityRepository(ImportHistory)
export class ImportHistoryRepository extends BaseRepository<ImportHistory> {}
