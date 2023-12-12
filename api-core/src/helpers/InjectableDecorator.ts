/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { container } from './Container'

interface Type<T> {
  new(...args: any[]): T
}

type InjectableOptions = {}

export const Injectable = (options?: InjectableOptions): Function => {
  return <T>(target: Type<T>, key: string) => {
    const properties = Reflect.getMetadata('design:paramtypes', target) || []

    const instance = new target(...properties)
    container.addProvider(target.name, instance)
  }
}
