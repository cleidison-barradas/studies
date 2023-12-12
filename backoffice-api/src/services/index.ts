import { schedule } from 'node-cron'
import { gmvService } from './gmv-service/gmvService'
import { integrationLogService } from './integration-log'
import { isDev } from '../utils/isDevelopment'

export const apiServices = async (): Promise<void> => {
  await gmvService()
  schedule(isDev() ? '*/2 * * * *' : '59 23 * * *', integrationLogService)
}