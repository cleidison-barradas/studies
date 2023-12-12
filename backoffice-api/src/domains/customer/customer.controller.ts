import { Get, JsonController, Post, Res } from '@mypharma/api-core'
import { Response } from 'express'
import CustomerService from './customer.service'

@JsonController('/v1/customer')
export default class CustomerController {
  @Get()
  async removeCpfIndexes(@Res() response: Response): Promise<unknown> {
    try {
      const customerService = new CustomerService()
      const customers = await customerService.getCustomers()

      return { customers }
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  }
}
