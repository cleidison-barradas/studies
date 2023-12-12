export type IFoodConnetionEvent = 'send_products' | 'finalized'

export interface IfoodConnection {
  tenant: string
  clientId: string
  lastUpdated?: string
  accessToken: string
  clientSecret: string
  clientStoreId: number
  event: IFoodConnetionEvent
  limitSentProducts?: number
}