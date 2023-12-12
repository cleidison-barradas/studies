/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entity as BaseEntity, EntityOptions } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'

export const LoadedEntities: any[] = []

export function Entity(options: EntityOptions, connectionType: ConnectionType) {
  return function (model: any): void {
    model.connectionType = connectionType
    LoadedEntities.push({
      type: connectionType,
      entity: model
    })

    BaseEntity(options)(model)
  }
}