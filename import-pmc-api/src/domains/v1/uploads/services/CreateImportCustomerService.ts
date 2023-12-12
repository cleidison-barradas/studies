import { v4 } from "uuid"
import { IXlsCustomer } from "../../../../interfaces/customer"
import { fixCustomerFieldType } from "../helpers/fixCustomerType"
import { xls } from "../helpers/xlsProduct"

interface ICreateImportCustomerDTO {
  tenant: string
  filePath: string
}

class CreateImportCustomerService {
  public async execute({ tenant, filePath }: ICreateImportCustomerDTO) {
    const data = xls<IXlsCustomer>(filePath)

    if (data.length <= 0) {

      throw Error('sheet_cannot_be_empty')
    }

    const redisKey = `${v4()}-${tenant}`
    const customers = fixCustomerFieldType(data)

    return {
      redisKey,
      customers
    }
  }
}

export default CreateImportCustomerService