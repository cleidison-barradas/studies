import { ImportHistoryRepository } from "@mypharma/api-core"
import { IModuleImport, IStatusImport } from "../interfaces/import"

interface RequestImportCountServiceDTO {
  tenant: string
  status: IStatusImport
  module: IModuleImport
}

class ImportHistoryCountService {
  public async execute({ tenant, status, module }: RequestImportCountServiceDTO) {

    return ImportHistoryRepository.repo(tenant).count({ status, module })
  }
}

export default ImportHistoryCountService