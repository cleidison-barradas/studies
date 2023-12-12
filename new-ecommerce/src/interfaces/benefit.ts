
export interface Benefit {
  _id: string,
  phone: string
  siteUrl: string
  clientId: number
  originalId: number
  clientName: string
  benefitName: string,
  requiresMembership: boolean
  allowCustomMembership: boolean
  createdAt?: Date
}
