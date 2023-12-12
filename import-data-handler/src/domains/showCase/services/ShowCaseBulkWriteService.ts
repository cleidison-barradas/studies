import { ShowcaseRepository } from "@mypharma/api-core"

interface ShowCaseBulkWriteServiceDTO {
  tenant: string
  bulkWrite: any[]
}

class ShowCaseBulkWriteService {
  constructor(private repository?: any) { }

  public async bulkWriteShowCase({ tenant, bulkWrite }: ShowCaseBulkWriteServiceDTO) {

    if (!this.repository) {

      return ShowcaseRepository.repo(tenant).bulkWrite(bulkWrite)
    }
  }
}

export default ShowCaseBulkWriteService