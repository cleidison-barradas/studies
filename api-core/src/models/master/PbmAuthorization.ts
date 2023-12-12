import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { ITransactionItems } from './PbmOrder'

/**
  * 1 - CRM;
  * 2 - CRO
*/
export type IMedicalProfessionalCouncil = 1 | 2

export interface IPrescriptor {
  prescriptorId: number
  prescritorState: string
  prescriptorRecipeDate: string
  medicalProfessionalCouncil: IMedicalProfessionalCouncil
}

@Entity({ name: 'pbmauthorization' }, ConnectionType.Master)
export class PbmAuthorization extends BaseModel {

  @Column({
    type: 'string'
    })
  storeId: string

  @Column({
    type: 'json'
    })
  prescriptor: IPrescriptor

  @Column({
    type: 'string'
    })
  fingerprint: string

  @Column({
    type: 'string'
    })
  elegibilityToken: string

  @Column({
    type: 'string'
    })
  tokenExpirationDate: string

  @Column({
    type: 'number'
    })
  authorizationId: number
  @Column({
    type: 'array'
    })
  productAuthorized: ITransactionItems[]

}