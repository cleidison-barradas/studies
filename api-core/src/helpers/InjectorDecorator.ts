/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { container } from './Container'

export const Inject = <T = any>(injectable: T, resolve?: any): any => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    if (!injectable) throw new Error('Could not make injection, insufficient params')

    if (resolve) {
      Object.defineProperty(target, propertyKey, {
        get: () => resolve,
        enumerable: true,
        configurable: true
      })
    } else {
      const token = (injectable as any).name
  
      Object.defineProperty(target, propertyKey, {
        get: () => container.resolve(token),
        enumerable: true,
        configurable: true
      })
    }
  }
}
