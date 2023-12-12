import SDR from './SDR'

export interface LeadStatus {
  status: string
  createdAt: Date
  updatedAt: Date
}
export default interface Lead {
  _id: string,
  name: string
  storeName: string
  cnpj: string
  storePhone: string
  ownerPhone: string
  email: string
  colaborator: string
  colaboratorCpf: string
  colaboratorCnpj: string
  colaboratorEmail: string
  colaboratorPhone: string
  status: string
  statusHistory: LeadStatus[]
  sdr: SDR
  createdAt?: Date,
  updatedAt?: Date
}
