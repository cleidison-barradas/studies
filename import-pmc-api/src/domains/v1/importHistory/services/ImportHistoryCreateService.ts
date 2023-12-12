import { ImportHistory, ImportHistoryRepository } from "@mypharma/api-core"
import { IModuleImport } from "../interfaces/import"

interface RequestImportCreateServiceDTO {
  path: string
  title?: string
  total?: number
  tenant: string
  module: IModuleImport
  createdAt?: Date
  updatedAt?: Date
}

class ImportHistoryCreateService {

  public async execute({ tenant, path, title, total, module, createdAt = new Date() }: RequestImportCreateServiceDTO) {
    let importHistory = new ImportHistory()

    importHistory._id = undefined
    importHistory.path = path
    importHistory.title = title
    importHistory.total = total
    importHistory.module = module
    importHistory.processed = 0
    importHistory.failures = 0
    importHistory.status = 'pending'
    importHistory.createdAt = createdAt

    return ImportHistoryRepository.repo(tenant).createDoc(importHistory)
  }
}

export default ImportHistoryCreateService