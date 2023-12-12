import moment from 'moment'

import { IntegrationStatus } from '../interfaces/integration.status'


export default function getIntegrationStatus(lastSeen: Date): string {
  lastSeen = new Date(lastSeen)

  let currentStatus: IntegrationStatus = 'healthy'

  const miliSecondsPerDay = 24*60*60*1000

  if (moment().diff(moment(lastSeen)) > miliSecondsPerDay && moment().diff(moment(lastSeen)) <= miliSecondsPerDay * 6) {
    currentStatus = 'warning'
  }

  if (moment().diff(moment(lastSeen)) > miliSecondsPerDay * 6) {
    currentStatus = 'problem'
  }

  if (!lastSeen) {
    currentStatus = 'unknown'
  }

  return currentStatus
}
