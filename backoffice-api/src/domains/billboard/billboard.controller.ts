import { Billboard, BodyParam, Delete, Get, JsonController, Param,Put, Res } from '@mypharma/api-core'
import { BillboardService } from './billboard.service'
import { Response } from 'express'

@JsonController('/v1/billboard')
export default class BillboardController {
  billboardService = new BillboardService()

  @Get()
  async find(@Res() response: Response): Promise<unknown> {
    try {
      const billboards = await this.billboardService.find()
      return { billboards }
    } catch (error) {
      console.log(error)
      return response.status(500).json({ error })
    }
  }

  @Get('/:id')
  async findByID(@Res() response: Response, @Param('id') id: string): Promise<unknown> {
    try {
      const billboard = await this.billboardService.findById(id)
      return { billboard }
    } catch ({ message }) {
      return response.status(500).json({ error: message })
    }
  }

  @Put()
  async save(@Res() response: Response, @BodyParam('billboard') data: Billboard): Promise<unknown> {
    try {
      const billboard = await this.billboardService.save(data)
      return { billboard }
    } catch (error) {
      console.log(error)
      return response.status(500).json({ error })
    }
  }

  @Delete('/:id')
  async delete(@Res() response: Response, @Param('id') id: string): Promise<unknown> {
    try {
      await this.billboardService.delete(id)
      return response.status(200).send()
    } catch (error) {
      console.log(error)
      return response.status(500).json({ error })
    }
  }
}
