import { BaseRepository } from '../base/BaseRepository'
import { Cupom } from '../../models/store/Cupom'
import { EntityRepository } from 'typeorm'

@EntityRepository(Cupom)
export class CupomRepository extends BaseRepository<Cupom> {}
