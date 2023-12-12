import { EntityRepository } from 'typeorm'
import { BaseRepository } from '../base/BaseRepository'
import { MarketingAutomation } from '../../models/store/MarketingAutomation'

@EntityRepository(MarketingAutomation)
export class MarketingAutomationRepository extends BaseRepository<MarketingAutomation> {}
