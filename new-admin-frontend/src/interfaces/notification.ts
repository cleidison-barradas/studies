import { FaturAgil } from '../context/NotificationContext'
import Product from './product'

export default interface Notification {
  _id?: string
  title: string
  message: string
  products?: Product[]
  faturAgil?: FaturAgil
  active: boolean
  type: string
  storeId: string
  createdAt?: Date
  startAt?: string
}