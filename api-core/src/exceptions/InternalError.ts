import { BaseException } from './base/BaseException'

export class InternalError extends BaseException { 
  constructor(message = '') {
    super(500, 'InternalError', message, 'internal_error')
  }
}
