import { QueuePluginGMV } from '../../../helpers/queue'

interface GMVGetTotalServiceDTO {
  origin: string
  endDate?: Date
  startDate?: Date
}

class GMVGetTotalService {

  public async getGMVTotal({ origin, startDate, endDate }: GMVGetTotalServiceDTO): Promise<void> {
    await QueuePluginGMV.publish('gmv-report', { origin, startDate, endDate })
  }
}


export default GMVGetTotalService
