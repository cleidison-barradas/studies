import { Lead } from '../../models/store/Lead'
import { EntityRepository } from 'typeorm'
import { BaseRepository } from '../base/BaseRepository'

@EntityRepository(Lead)
export class LeadRepository extends BaseRepository<Lead> {}
