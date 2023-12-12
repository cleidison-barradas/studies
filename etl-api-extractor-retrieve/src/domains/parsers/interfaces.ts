import { IProductResponse } from '../../interfaces/IProductResponse'

export interface IProcess {
  token: string
  tenant: string
  userId: string
  erpUser?: string,
  handle: (...args: any) => Promise<IProductResponse[]>,
  baseUrl?: string
}
