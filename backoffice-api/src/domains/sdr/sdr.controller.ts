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
  Sdr,
  UseBefore,
} from '@mypharma/api-core'
import { Response } from 'express'

import { IGetSdrRequest, IPostSdrRequest } from './interfaces/sdr.request'

import createSdrService from './services/SdrCreate.service'
import getSdrsAndCountService from './services/SdrGet.service'
import getSdrByIdService from './services/SdrGetById.service'
import updateSdrService from './services/SdrUpdate.service'
import softDeleteSdrService from './services/SdrDelete.service'
import validateSdrService from './services/SdrValidate.service'

@JsonController('/v1/sdrs')
@UseBefore(AuthHandlerMiddleware)
export default class SdrController {
  @Get()
  async getSdrs(@Res() response: Response, @Req() request: ApiRequest, @QueryParams() query: IGetSdrRequest): Promise<unknown> {
    const { limit = 20, page = 1 } = query

    try {
      const [sdrs, total] = await getSdrsAndCountService(query)

      return response.json({ sdrs, limit: Number(limit), currentPage: Number(page), total })
    } catch (error) {
      console.log(error)
      return response.status(500).json({ error })
    }
  }

  @Get('/:id')
  async getSdr(@Res() response: Response, @Param('id') id: string): Promise<unknown> {
    try {
      const sdr = await getSdrByIdService(id)

      return response.json({ sdr })
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: 'internal_server_error'
      })
    }
  }

  @Post()
  async createSdr(@Res() response: Response, @Body() body: IPostSdrRequest): Promise<unknown> {
    try {
      const { name = '', email = '', willReceveLeadsEmail = true } = body

      const sdrExists = await validateSdrService(email)

      if (sdrExists > 0) {
        return response.status(401).json({
          error: 'email_already_used'
        })
      }

      const requestObj = {
        name,
        email,
        willReceveLeadsEmail,
      }

      const created = await createSdrService(requestObj)

      return response.status(201).json({ sdr: created })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: error.message })
    }
  }

  @Delete('/:id')
  async deleteSdr(@Res() response: Response, @Param('id') id: string): Promise<string | unknown> {
    try {
      await softDeleteSdrService(id)

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

  @Put('/')
  async updateSdr(@Res() response: Response, @Body() body: IPostSdrRequest): Promise<Sdr | unknown> {
    const { _id, name, email, willReceveLeadsEmail } = body

    try {
      const sdr = await getSdrByIdService(_id)

      const sdrExists = await validateSdrService(email)

      if (sdr.email !== email && sdrExists > 0) {
        return response.status(401).json({
          error: 'email_already_used'
        })
      }

      const updatedSdr = await updateSdrService(_id, name, email, willReceveLeadsEmail)

      return response.json({
        updatedSdr
      })

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: 'internal_server_error'
      })
    }
  }
}
