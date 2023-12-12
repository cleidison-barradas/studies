import { ImportHistoryRepository } from "@mypharma/api-core"
import { ObjectId } from 'bson'

export type IStatusImport = 'pending' | 'finished' | 'failure'

interface RequestImportUpdateServiceDTO {
  tenant: string
  importId?: string
  processed?: number
  failures?: number
  status: IStatusImport
}

class ImportUpdateService {
  public async execute({ importId, tenant, ...rest }: RequestImportUpdateServiceDTO) {

    if (!importId) return null

    const _id = new ObjectId(importId)

    return ImportHistoryRepository.repo(tenant).updateOne(
      { _id },
      {
        $set: { ...rest, updatedAt: new Date() }
      })
  }
}

export default ImportUpdateService