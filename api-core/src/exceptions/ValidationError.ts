import { BaseException } from './base/BaseException'

export class ValidationError extends BaseException { 
  constructor(message = '') {
    super(403, 'ValidationError', message, 'validation_error')
  }
}
