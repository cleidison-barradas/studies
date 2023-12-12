import { Middleware, ExpressMiddlewareInterface } from '@mypharma/api-core'
import { json, Request, Response, NextFunction } from 'express'

@Middleware({ type: 'before' })
export class RawBodyMiddleware implements ExpressMiddlewareInterface {
  private jsonBodyParser

  constructor() {
    this.jsonBodyParser = json({ limit: '50mb' })
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  use(req: Request, res: Response, next: NextFunction) {
    this.jsonBodyParser(req, res, next)
  }
}
