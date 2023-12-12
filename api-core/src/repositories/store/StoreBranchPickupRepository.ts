import { BaseRepository } from '../base/BaseRepository'
import { EntityRepository } from 'typeorm'
import { StoreBranchPickup } from '../../models/store/StoreBranchPickup'

@EntityRepository(StoreBranchPickup)
export class StoreBranchPickupRepository extends BaseRepository<StoreBranchPickup> { }
