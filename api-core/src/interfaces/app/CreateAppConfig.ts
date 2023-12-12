/* eslint-disable @typescript-eslint/ban-types */
import { RoutingControllersOptions } from 'routing-controllers'

export interface ICreateAppConfig extends RoutingControllersOptions {
  controllers: Function[] | string[],
  middlewares?: Function[],
  middlewareWhiteList?: string[]
}
