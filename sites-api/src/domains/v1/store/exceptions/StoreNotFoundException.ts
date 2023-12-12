import { BaseException } from '@mypharma/api-core'

export class StoreNotFoundException extends BaseException { 
  constructor(message = '') {
    super(404, 'StoreNotFound', message, 'store_not_found')
  }
}
