import {
  Validate, 
  Response,

  JsonController,
  Body,
  Get,
  Post
} from '@mypharma/api-core'
import { ValidationExample } from '../interfaces/ValidationExample'

@JsonController('/')
export class DefaultController {
  @Get('/')
  public index() {
    return Response.error('PageNotFoundException', 'Page not found')
  }

  @Get('health-check')
  public healthCheck() {
    return Response.success({
      ok: true
    })
  }

  @Post('validation-example')
  @Validate({
    name: 'required|string',
    email: 'email'
    })
  public validationExample(@Body() body: ValidationExample) {
    return Response.success({
      ...body
    })
  }
}
