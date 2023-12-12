import { v4 } from 'uuid'
import { ImportType } from '../../../../interfaces/importType'
import { IXlsPromotion, } from '../../../../interfaces/product'
import { fixPromotionFieldType } from '../helpers/fixPromotionType'
import { xls } from '../helpers/xlsProduct'

interface UploadGetPromotionXlsDataServiceDTO {
  tenant: string
  type: ImportType
  filePath: string,
  date_start: string
  date_end: string
}

class UploadGetPromotionXlsDataService {

  public async getPromotionXlsData({ tenant, filePath, date_start, date_end }: UploadGetPromotionXlsDataServiceDTO) {
    const data = xls<IXlsPromotion>(filePath)

    if (data.length <= 0) {

      throw Error('sheet_cannot_be_empty')
    }

    const redisKey = `${v4()}-${tenant}`
    const promotions = fixPromotionFieldType(data, date_start, date_end)

    return {
      redisKey,
      promotions
    }
  }
}

export default UploadGetPromotionXlsDataService