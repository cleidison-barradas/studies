import { ProductControlRepository } from '@mypharma/api-core'
import { IQueryParams } from '../../interfaces/queryParams'

class ControlService {
  async getProductControl(queryParams: IQueryParams) {
    const { page, limit, query } = queryParams
    let where: Record<any, any> = {}

    if (query) {
      where = {
        $or: [{ description: new RegExp(query, 'i') }],
      }
    }

    return ProductControlRepository.repo().paginate(where, { page, limit })
  }
}

export default new ControlService()
