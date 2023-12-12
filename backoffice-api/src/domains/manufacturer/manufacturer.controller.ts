import { Get, JsonController, QueryParam } from '@mypharma/api-core'
import ManufacturerService from './manufacturer.service'

@JsonController('/v1/manufacturer')
export default class ManufacturerController {
  manufacturerService: ManufacturerService = new ManufacturerService()

  @Get()
  async getManufacturers( @QueryParam('name') name : string ): Promise<unknown> {
    const manufacturers = await this.manufacturerService.find(name)

    return { manufacturers }
  }
}
