import { ObjectID } from '@mypharma/api-core'

export interface PMCData {
  ean: string
  region_1: number,
  region_2: number,
  region_3: number,
  region_4: number,
  region_5: number
}

export interface RequestUpdatePMCValues {
  tenants: string[]
  pmcValues: PMCData[]
}

export interface PMCValues {
  ean: string
  region_id: ObjectID
  value: number
}