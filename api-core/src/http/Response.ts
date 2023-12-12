/* eslint-disable @typescript-eslint/no-namespace */
import { BaseException } from '../exceptions/base/BaseException'
import { Exception } from '../exceptions/Exception'
import { ApiResponse } from '../interfaces/app/ApiResponse'

export namespace Response {
  const allExceptions = Exception.all()

  type ExceptionName = typeof allExceptions[number]

  export const success = (data?: unknown, status?: number): ApiResponse => {
    return {
      status: status || 200,
      data: data || null
    }
  }
  
  export const error = (exceptionName: ExceptionName, message?: string): BaseException => {
    if (!allExceptions.includes(exceptionName)) return Exception.InternalErrorException(`${exceptionName}: ${message}`)
  
    return Exception[exceptionName](message)
  }
}
