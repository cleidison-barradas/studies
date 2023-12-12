import { ExpressMiddlewareInterface } from 'routing-controllers'
import { Request, Response, NextFunction } from 'express'

export abstract class BaseMiddleware implements ExpressMiddlewareInterface {
  protected static whitelist: string[] = [
    '/',
    '/health-check',
    '/favicon.ico'
  ]

  public static setWhitelist(routes: string[]): void {
    this.whitelist = [
      ...this.whitelist,
      ...routes
    ]
  }

  protected handler(request: Request, response: Response, next: NextFunction): void {
    return next()
  }

  use(request: Request, response: Response, next: NextFunction): void {
    if (BaseMiddleware.whitelist.includes(request.path)) {
      return next()
    }
    return this.handler(request, response, next)
  }
}
