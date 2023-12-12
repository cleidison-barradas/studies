import { BaseRepository } from '../base/BaseRepository'
import { RequestLog } from '../../models/log/RequestLog'
import { EntityRepository } from 'typeorm'

@EntityRepository(RequestLog)
export class RequestLogRepository extends BaseRepository<RequestLog> {}
