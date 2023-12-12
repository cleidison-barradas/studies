import { BaseException } from './base/BaseException'

export class InvalidSession extends BaseException { 
  constructor(message = '') {
    super(403, 'InvalidSession', message, 'invalid_session')
  }
}
