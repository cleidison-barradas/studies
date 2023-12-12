import { Entity, Column } from 'typeorm'
import { Store } from './Store'
import { User } from './User'
import { BaseModel } from '../../../../support/models/base/BaseModel'
import { SearchResult } from '../../../../support/interfaces/SearchResult'

@Entity()
export class Search extends BaseModel {
  @Column()
  fingerprint: string

  @Column()
  term: string

  @Column()
  origin: string

  @Column()
  store: Store

  @Column({ nullable: true })
  user: User | null

  @Column()
  result: SearchResult[]

  @Column()
  converted: Boolean
}
