/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, ApiRequest, Get, Req, UseBefore, AuthTenancyMiddleware, JsonController, Post, Body, Customer, Param, Res, CustomerTenancyMiddleware } from '@mypharma/api-core'
import { getCustomer } from '../../../../support/services/CustomerService'
import IPostCustomer from '../interfaces/IPostCustomer'
import { unsubscribeCustomer, updateCustomer, updateOrCreateFirebaseToken } from '../services/CustomerService'
import { IPostFirebaseBody } from '../interfaces/IPostFirebase'
import { Response as IResponse } from 'express'

@JsonController('/v1/customer')
export class AboutUsController {
  @Get('/')
  @UseBefore(AuthTenancyMiddleware)
  public async index(@Req() request: ApiRequest) {
    try {
      const { user, store } = request.session

      const { _id, firstname, lastname, email, phone, addresses, status, createdAt } = await getCustomer(request.tenant, user._id)

      return {
        user: {
          customer_id: _id,
          customer_group_id: 0,
          store_id: store,
          firstname,
          lastname,
          email,
          telephone: phone,
          address_id: addresses.find((value: any) => value.status === true) || null,
          status,
          date_added: createdAt,
        },
      }
    } catch (error) {
      return Response.error(error.name, error.message)
    }
  }

  @Post('/update')
  @UseBefore(AuthTenancyMiddleware)
  public async update(@Req() request: ApiRequest, @Body() body: IPostCustomer) {
    const { tenant, session } = request
    const { user } = session
    const updateObj = {}

    Object.keys(body).map((key) => {
      if (key && key === 'telephone') {
        return (updateObj['phone'] = body[key])
      }
      if (key) {
        updateObj[key] = body[key]
      }
      return key
    })

    await updateCustomer(tenant, user._id, updateObj)

    const customer = await getCustomer(tenant, user._id)
    return { user: customer }
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

      await unsubscribeCustomer(tenant, email)
      return response.status(200).send()
    } catch (error) {
      console.log(error)
      return response.status(500).json({ error })
    }
  }
}
