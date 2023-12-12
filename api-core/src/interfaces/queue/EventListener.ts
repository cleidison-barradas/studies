import { GenericObject } from '../generics/GenericObject'

export interface IEventListener {
  tag: string,
  routingKey: string,
  properties: GenericObject,
  content: GenericObject | string | null
}
