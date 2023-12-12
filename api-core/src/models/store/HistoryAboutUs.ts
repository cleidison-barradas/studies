import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { AboutUs } from './AboutUs'
import { StoreUser } from '../master/StoreUser'

@Entity({ name: 'historyAboutUs' }, ConnectionType.Store)
export class HistoryAboutUs extends BaseModel {
  @Column({
    type: 'string'
    })
  oldContent: string

  @Column()
  aboutUs: AboutUs

  @Column()
  user: StoreUser | null
}
