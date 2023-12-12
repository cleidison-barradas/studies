import { PaymentLink } from './../../models/store/PaymentLink'
import { EntityRepository } from 'typeorm'
import { BaseRepository } from '../base/BaseRepository'

@EntityRepository(PaymentLink)
export class PaymentLinkRepository extends BaseRepository<PaymentLink> {}
