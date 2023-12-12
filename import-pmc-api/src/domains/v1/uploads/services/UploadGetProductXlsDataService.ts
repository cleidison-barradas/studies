import { v4 } from 'uuid'

import { xls } from '../helpers/xlsProduct'
import { IXlsProduct, } from '../../../../interfaces/product'
import { fixProductFieldType } from '../helpers/fixProductType'
import { filter } from '../helpers/filterProducts'

interface UploadGetProductXlsDataServiceDTO {
  tenant: string
  filePath: string
}

class UploadGetProductXlsDataService {

  public async getProductXlsData({ tenant, filePath }: UploadGetProductXlsDataServiceDTO) {
    const data = xls<IXlsProduct>(filePath)
    const redisKey = `${v4()}-${tenant}`

    if (data.length <= 0) {

      throw Error('sheet_cannot_be_empty')
    }

    let products = fixProductFieldType(data)

    products = filter(products)

    return {
      redisKey,
      products
    }
  }
}

export default UploadGetProductXlsDataService