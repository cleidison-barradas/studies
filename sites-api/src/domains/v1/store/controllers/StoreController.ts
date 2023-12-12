import {
  Get,
  JsonController,
  Param,
} from '@mypharma/api-core'
import { StoreNotFoundException } from '../exceptions/StoreNotFoundException'
import { StoreService } from '../services/StoreService'

@JsonController('/v1/store')
export class StoreController {

  private storeService: StoreService

  constructor() {
    this.storeService = new StoreService()
  }

  @Get('/:storeId')
  public async index(@Param('storeId') storeId: string) {
    const store = await this.storeService.getStore(storeId)

    if (!store) {
      throw new StoreNotFoundException()
    }

    return {
      store
    }
  }
}