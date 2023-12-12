import { Response } from 'express'
import {
  AuthHandlerMiddleware,
  Body,
  Delete,
  Get,
  JsonController,
  ORM,
  Param,
  Post,
  Put,
  QueryParams,
  Res,
  UseBefore,
} from '@mypharma/api-core'
import ErpService from './erp.service'
import { ICreateErp, IGetErpRequest, IUpdateErp } from './interfaces/erp.request'
const { DATABASE_INTEGRATION_NAME } = process.env

@JsonController('/v1/erp')
@UseBefore(AuthHandlerMiddleware)
export default class ErpController {
  @Get()
  async find(@Res() response: Response, @QueryParams() params: IGetErpRequest): Promise<unknown> {
    try {
      const { limit = 20, page = 1 } = params
      await ORM.setup(undefined, DATABASE_INTEGRATION_NAME)

      const erpService = new ErpService()
      const erps = await erpService.getErps(params)
      const total = await erpService.count(params)

      return { erps, limit: Number(limit), currentPage: Number(page), total }
    } catch (error) {
      console.log(error)
      return response.status(500).json({ error })
    }
  }

  @Get('/version')
  async findVersion(@Res() response: Response, @QueryParams() params: IGetErpRequest): Promise<unknown> {
    try {
      await ORM.setup(undefined, DATABASE_INTEGRATION_NAME)

      const erpService = new ErpService()
      const versions = await erpService.getErpVersion(params)

      return { versions }
    } catch (error) {
      console.log(error)
      return response.status(500).json({ error })
    }
  }

  @Get('/:id')
  async findOne(@Res() response: Response, @Param('id') id: string): Promise<unknown> {
    try {
      await ORM.setup(undefined, DATABASE_INTEGRATION_NAME)

      const erpService = new ErpService()
      const erp = await erpService.getErp(id)

      return { erp }
    } catch (error) {
      console.log(error)
      return response.status(500).json({ error })
    }
  }

  @Put()
  async create(@Res() response: Response, @Body() body: ICreateErp): Promise<unknown> {
    const { erp } = body
    try {
      const newErp = await new ErpService().createErp(erp)
      return { erp: newErp }
    } catch (error) {
      console.log(error)
      return response.status(500).json({ error })
    }
  }

  @Post()
  async update(@Res() response: Response, @Body() body: IUpdateErp): Promise<unknown> {
    const { erp } = body
    try {
      const erpService = new ErpService()
      const updatedErp = await erpService.update(erp)
      return { erp: updatedErp }
    } catch (error) {
      console.log(error)
      return response.status(500).json({ error })
    }
  }

  @Delete('/:id')
  async delete(@Res() response: Response, @Param('id') id: string): Promise<unknown> {
    try {
      const erpService = new ErpService()
      await erpService.remove(id)
      return { deletedId: id }
    } catch (error) {
      console.log(error)
      return response.status(500).json({ error })
    }
  }
}
