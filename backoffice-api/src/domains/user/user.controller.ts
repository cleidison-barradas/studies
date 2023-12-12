/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ApiRequest,
  AuthHandlerMiddleware,
  Body,
  Delete,
  Get,
  JsonController,
  ObjectID,
  Param,
  Post,
  Put,
  QueryParams,
  Req,
  Res,
  UseBefore,
  User,
} from '@mypharma/api-core'
import { Response } from 'express'
import { IGetUserRequest, IPostUserRequest } from './interfaces/user.request'
import UserService from './user.service'

import UserGetByUserIdService from './services/UserGetByUserIdService'
import StoreGetStoreByStoreIdsService from '../store/services/StoreGetStoreByStoreIdsService'

const storeGetStoreByStoreIdsService = new StoreGetStoreByStoreIdsService()
const userGetByUserIdService = new UserGetByUserIdService()

@JsonController('/v1/user')
@UseBefore(AuthHandlerMiddleware)
export class UserController {
  @Get()
  async getUsers(@Res() response: Response, @Req() request: ApiRequest, @QueryParams() query: IGetUserRequest): Promise<unknown> {
    const { limit = 20, page = 1 } = query

    try {
      const userService = new UserService()
      const users = await userService.getUsers(query)
      const total = await userService.countUser(query)

      return { users, limit: Number(limit), currentPage: Number(page), total }
    } catch (error) {
      console.log(error)
      return response.status(500).json({ error })
    }
  }

  @Post()
  async createUser(@Res() response: Response, @Body() body: IPostUserRequest): Promise<unknown> {
    try {
      const { userName, email, password, status, store, role } = body
      const userService = new UserService()

      const userExists = await userService.validateUser(userName)

      if (userExists > 0) {
        return response.status(400).json({
          error: 'userName_already_used'
        })
      }

      const requestObj = {
        userName,
        password,
        status,
        email,
        role,
        store: store.map(s => new ObjectID(s._id.toString()))
      }

      const created = await userService.createUser(requestObj)

      return response.status(201).json({ user: created })
    } catch (error) {
      console.log(error)
      return response.status(500).json({ error: error.message })
    }
  }

  @Get('/:userId')
  async getUser(@Res() response: Response, @Param('userId') userId: string): Promise<unknown> {
    try {

      const user = await userGetByUserIdService.getUserByUserId({ userId })

      const store = await storeGetStoreByStoreIdsService.getStoreByStoreIds({ storeIds: user.store })

      return {
        user: {
          ...user,
          store
        }
      }
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: error.message
      })
    }
  }

  @Delete('/:id')
  async deleteUser(@Res() response: Response, @Param('id') id: string): Promise<string | unknown> {
    try {
      const userService = new UserService()
      await userService.softDelete(id)

      return response.json({
        deletedId: id
      })

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: 'internal_server_error'
      })
    }
  }

  @Put()
  async updateUser(@Res() response: Response, @Body() body: IPostUserRequest): Promise<User | unknown> {
    const { _id, store, ...request } = body

    try {
      const userService = new UserService()

      await userService.updateUser({
        ...request,
        store: store.map(s => new ObjectID(s._id.toString()))
      })
      const user = await userService.getUserDetail(_id)

      return response.json({
        user
      })

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: 'internal_server_error'
      })
    }
  }
}
