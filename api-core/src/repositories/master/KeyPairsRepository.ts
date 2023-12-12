import { EntityRepository } from 'typeorm'
import { BaseRepository } from '../base/BaseRepository'
import { KeyPairs } from '../../models/master/KeyPairs'

@EntityRepository(KeyPairs)
export class KeyPairsRepository extends BaseRepository<KeyPairs> {}
