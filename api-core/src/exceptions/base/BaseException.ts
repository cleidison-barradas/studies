import { HttpError } from 'routing-controllers'
import { ApiResponse } from '../../interfaces/app/ApiResponse'

export class BaseException extends HttpError {
  constructor(
    public status: number,
    public name: string,
    public message: string,
    public code: string
  ) {
    super(status, message)

    // Unnecessary
    delete this.httpCode
  }

  public toJSON(): ApiResponse {
    return {
      status: this.status,
      error: this.name,
      message: this.message,
      code: this.code,
      data: null
    }
  }
}
