import { BaseException } from './base/BaseException'

export class UserNotFound extends BaseException { 
  constructor(message = '') {
    super(404, 'UserNotFound', message, 'user_not_found')
  }
}
