import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { GenericObject } from '../../interfaces/generics/GenericObject'
import { Pmc } from '../master/Pmc'
import { StorePlan } from './StorePlan'
import { StoreUrls } from './StoreUrls'
import { IntegrationErp } from '../integration/IntegrationErp'
import { ObjectId } from 'bson'

export type IAffiliateEntities = 'PRODUCT' | 'BANNERS' | 'CUPOM' | 'ABOUTUS' | 'PROMOTION' | 'SHOWCASE'
export type IAffiliateActions = 'CREATE' | 'UPDATE' | 'DELETE'

export interface IAffiliateStore {
  _id: ObjectId
  entity: IAffiliateEntities[],
  action: IAffiliateActions[]
}

@Entity({ name: 'store' }, ConnectionType.Master)
export class Store extends BaseModel {
  @Column({
    type: 'text'
    })
  name: string

  @Column({
    type: 'text'
    })
  url: string

  @Column({
    type: 'text'
    })
  tenant: string

  @Column(() => Pmc)
  pmc: Pmc

  @Column({
    type: 'json'
    })
  settings: GenericObject

  @Column(() => StorePlan)
  plan: StorePlan

  @Column(() => IntegrationErp)
  erp: IntegrationErp

  @Column({
    type: 'boolean'
    })
  mainStore: boolean

  @Column({
    type: 'array'
    })
  affiliateStores: Array<IAffiliateStore>

  @Column({
    type: 'array'
    })
  storeUrls?: Array<StoreUrls>
}
