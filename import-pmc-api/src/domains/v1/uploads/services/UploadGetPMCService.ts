import { v4 } from "uuid"
import { XLSPMCData } from "../../../../interfaces/pmc"
import { filterValidPMC } from "../helpers/filterValidPMC"
import { fixPMCFieldType } from "../helpers/fixPmcType"
import { xls } from "../helpers/xlsProduct"

interface UploadGetPMCSeviceDTO {
  filePath: string
}

class UploadGetPMCSevice {
  constructor(private repository?: any) { }

  public async getPMCImportData({ filePath }: UploadGetPMCSeviceDTO) {

    const xlsData = xls<XLSPMCData>(filePath)

    if (xlsData.length <= 0) {

      throw Error('sheet_cannot_be_empty')
    }

    const fixedPmcValues = fixPMCFieldType(xlsData)

    const pmcValues = filterValidPMC(fixedPmcValues)

    const redisKey = `update_pmc_${v4()}`

    return {
      redisKey,
      pmcValues
    }

  }
}

export default UploadGetPMCSevice