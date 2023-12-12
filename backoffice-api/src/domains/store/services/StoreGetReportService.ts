import { File, FileRepository } from '@mypharma/api-core'

interface StoreGetReportServiceDTO {
  key: string
}

class StoreGetReportService {

  /**
   * getStoreGmv
   */
  public getStoreGmv({ key }: StoreGetReportServiceDTO): Promise<File | null> {

    return FileRepository.repo().findOne({
      where: {
        key
      }
    })
  }
}

export default StoreGetReportService
