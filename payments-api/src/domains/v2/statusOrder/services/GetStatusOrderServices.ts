import { StatusOrderRepository } from "@mypharma/api-core"
import { databaseConfig } from "../../../../config/database"

interface RequestGetStatusOrderServiceDTO {
  type?: string[]
}

class GetStatusOrderService {

  public async execute({ type = ['pending', 'rejected'] }: RequestGetStatusOrderServiceDTO) {
    const where = { type: { $in: type } }

    return StatusOrderRepository.repo(databaseConfig.name).find({
      where
    })
  }
}

export default GetStatusOrderService