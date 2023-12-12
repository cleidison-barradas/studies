export interface ISendBackQueue {
  uuid: string
  invalidate: string[]
  invalidatedTenants?: string[]
}