import { BaseRepository } from '../base/BaseRepository'
import { EntityRepository } from 'typeorm'
import { Module } from '../../models/master/Module'

@EntityRepository(Module)
export class ModuleRepository extends BaseRepository<Module> {}
