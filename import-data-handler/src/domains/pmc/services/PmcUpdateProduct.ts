import PmcGetRegionValueService from "../../pmc/services/PmcGetRegionValueService"
import ProductBulkWriteService from "../../product/service/ProductBulkWriteService"
import ProductGetProductByEansService from "../../product/service/ProductGetProductByEansService"

import { PMCData } from "../../../interfaces/pmc"
import { InvalidateCache } from "../../../interfaces/invalidate"

const productBulkWriteService = new ProductBulkWriteService()

const pmcGetRegionValueService = new PmcGetRegionValueService()
const productGetProductByEansService = new ProductGetProductByEansService()

const updateHandlerPMC = async (tenant: string, pmcs: PMCData[]) => {

  const bulkWrite: any[] = []
  const invalidate: InvalidateCache[] = []
  const EANS = pmcs.map(p => p.ean.toString())

  const products = await productGetProductByEansService.getProductsByEans({ EANS, tenant })

  const regionValues = await pmcGetRegionValueService.getPmcRegions({ pmcs })

  if (products.length > 0 && regionValues.size > 0) {

    for (const product of products) {

      const pmcValues = regionValues.get(product.EAN.toString())

      if (pmcValues) {

        bulkWrite.push({
          updateOne: {
            filter: { EAN: product.EAN.toString() },
            update: {
              '$set': {
                pmcValues,
                updatedAt: new Date(),
                updateOrigin: 'xls-pmc',
              }
            }
          }
        })

        invalidate.push({
          tenant,
          ean: product.EAN,
        })
      }
    }
  }

  if (bulkWrite.length > 0) {

    const response = await productBulkWriteService.bulkWriteProduct({ tenant, bulkWrite })
    console.log(`proccessed ${response.modifiedCount} products on ${tenant}`)
  }

  return {
    invalidate
  }
}



export const pmcService = async (tenant: string, entries: PMCData[] = []) => {

  const { invalidate = [] } = await updateHandlerPMC(tenant, entries)

  return invalidate

}