import { Request } from 'express'
import { ISession } from '../auth/Session'
import { GenericObject } from '../generics/GenericObject'

export interface ApiRequest<T = GenericObject> extends Request {
  tenant: string,
  session: ISession<T>
}
