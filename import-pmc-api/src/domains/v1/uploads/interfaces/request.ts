import { PMCData } from "../../../../interfaces/pmc"
import { IImportType } from "./importType"

export interface RequestUploadPromotionBody {
  file: File
  update: boolean
  type: IImportType
  date_start: string
  date_end: string
}

export interface RequestImportPMCBody {
  file: any
  store?: string
}

export interface RequestUpdatePMCValues {
  tenants: string[]
  pmcValues: PMCData[]
}