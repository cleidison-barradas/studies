export type ImportType = 'product' | 'promotion' | 'customer'

export type ImportModule = 'customer' | 'product' | 'promotion' | 'specials'

export interface IIimportData {
  tenant: string
  redisKey: string
  importId?: string,
  action: ImportType,
}
