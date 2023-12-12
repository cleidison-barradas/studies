import { BaseException } from './base/BaseException'
import { InternalError } from './InternalError'
import { ValidationError } from './ValidationError'
import { InvalidSession } from './InvalidSession'
import { PageNotFound } from './PageNotFound'
import { UserNotFound } from './UserNotFound'
import { FailedLogin } from './FailedLogin'

export abstract class Exception {
  static all(): string[] {
    return Object.getOwnPropertyNames(Exception).filter(ex => ex.includes('Exception'))
  }

  static InternalErrorException = (message?: string): BaseException => {
    return new InternalError(message)
  }

  static ValidationErrorException = (message?: string): BaseException => {
    return new ValidationError(message)
  }

  static InvalidSessionException = (message?: string): BaseException => {
    return new InvalidSession(message)
  }

  static PageNotFoundException = (message?: string): BaseException => {
    return new PageNotFound(message)
  }

  static UserNotFoundException = (message?: string): BaseException => {
    return new UserNotFound(message)
  }

  static FailedLoginException = (message?: string): BaseException => {
    return new FailedLogin(message)
  }
}
