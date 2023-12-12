import { Response, JsonController, Post, Body, NeighborhoodRepository } from '@mypharma/api-core'
import { IRequest } from './interfaces/request'
import { createNeighborhood } from './neighborhood.service'

@JsonController('/v2/neighborhood')
export class NeighborhoodController {
  @Post('/')
  public async create(@Body() body: IRequest) {
    try {
      const {name, city, state = '', code = ''} = body
      const created = await createNeighborhood({name, city, state, code})
      const neighborhood = await NeighborhoodRepository.repo().findOne({_id: created._id})
      return { neighborhood }
    } catch (error) {
      return Response.error(error.name, error.message)
    }
  }
}