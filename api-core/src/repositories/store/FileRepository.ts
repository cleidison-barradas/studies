import { EntityRepository } from 'typeorm'
import { BaseRepository } from '../base/BaseRepository'
import { File } from '../../models/store/File'

@EntityRepository(File)
export class FileRepository extends BaseRepository<File> {}
