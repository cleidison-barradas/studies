import { BaseException } from './base/BaseException'

export class PageNotFound extends BaseException { 
  constructor(message = '') {
    super(404, 'PageNotFound', message, 'page_not_found')
  }
}
