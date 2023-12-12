import ImportData from "./importData"

export type IModuleImportType = 'customer' | 'product' | 'promotion'

export default interface ImportHistory {
  _id?: string,
  total: number
  title: string
  status: string
  module: IModuleImportType
  processed: number
  failures: number
  importData: ImportData[]
  createdAt?: Date
  updatedAt?: Date
}
