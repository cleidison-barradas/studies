import { BaseException } from './base/BaseException'

export class FailedLogin extends BaseException { 
  constructor(message = '') {
    super(404, 'FailedLogin', message, 'username_password_invalid')
  }
}
