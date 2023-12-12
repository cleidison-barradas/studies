import { ConnectionOptions } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'

export type IConnectionConfig = ConnectionOptions & {
  connectionType: ConnectionType,
  retryWrites?: boolean
}
