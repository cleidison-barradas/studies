/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Res, Get, Req, Post, Body, Param, Customer, Response, UseBefore, ApiRequest, JsonController, AuthTenancyMiddleware, CustomerTenancyMiddleware } from '@mypharma/api-core'
import { getCustomer } from '../../../support/services/CustomerService'
import IPostCustomer from './interfaces/IPostCustomer'
import { unsubscribeCustomer, updateOrCreateFirebaseToken } from './customer.service'
import { IPostFirebaseBody } from './interfaces/IPostFirebase'
import { Response as IResponse } from 'express'

import CustomerUpdateCustomerService from './services/CustomerUpdateCustomerService'
import CustomerValidateCustomerDocumentService from './services/CustomerValidateCustomerDocumentService'

const customerUpdateCustomerService = new CustomerUpdateCustomerService()
const customerValidateCustomerDocumentService = new CustomerValidateCustomerDocumentService()

@JsonController('/v2/customer')
export class AboutUsController {
  @Get('/')
  @UseBefore(AuthTenancyMiddleware)
  public async index(@Req() request: ApiRequest) {
    try {
      const { user } = request.session

      const customer = await getCustomer(request.tenant, user._id)

      return { customer }
    } catch (error) {
      return Response.error(error.name, error.message)
    }
  }

  @Post('/')
  @UseBefore(AuthTenancyMiddleware)
  public async update(@Req() request: ApiRequest, @Body() body: IPostCustomer, @Res() response: IResponse) {
    try {
      const { tenant, session } = request
      const { user } = session
      const customerId = user._id.toString()
      const { cpf = '', firstname, lastname, phone } = body

      const doc = customerValidateCustomerDocumentService.formatDocument(cpf)

      const customer = await customerUpdateCustomerService.updateCustomer({
        phone,
        tenant,
        cpf: doc,
        lastname,
        firstname,
        customerId,
      })

      return response.json({
        firstname: customer.firstname,
        lastname: customer.lastname,
        email: customer.email,
        telephone: customer.phone,
        status: customer.status,
        cpf: customer.cpf,
      })
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: error.message,
      })
    }
  }

  @Post('/firebase')
  @UseBefore(AuthTenancyMiddleware)
  public async firebase(@Req() request: ApiRequest<Customer>, @Body() body: IPostFirebaseBody) {
    const { tenant, session } = request
    const { user, store } = session
    const { token } = body

    await updateOrCreateFirebaseToken(tenant, user._id, store, token)

    return { success: true }
  }

  @Post('/unsubscribe/:email')
  @UseBefore(CustomerTenancyMiddleware)
  public async unsubscribe(@Req() request: ApiRequest, @Param('email') email: string, @Res() response: IResponse) {
    try {
      const { tenant } = request
      console.log(tenant)
      await unsubscribeCustomer(tenant, email)
      return response.status(200).send()
    } catch (error) {
      console.log(error)
      return response.status(500).json({ error })
    }
  }
}
