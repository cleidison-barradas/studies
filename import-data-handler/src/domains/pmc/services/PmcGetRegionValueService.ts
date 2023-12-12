import { ObjectID, PmcRepository } from "@mypharma/api-core"
import { PMCData, PMCValues } from "../../../interfaces/pmc"

interface PmcGetRegionValueServiceDTO {
  pmcs: PMCData[]
}

class PmcGetRegionValueService {
  constructor(private repository?: any) { }

  public async getPmcRegions({ pmcs }: PmcGetRegionValueServiceDTO) {
    const pmcValues = new Map<string, PMCValues[]>([])
    const pmcRegions = await PmcRepository.repo().find({ select: ['_id', 'originalId'] })

    pmcs.forEach(_pmc => {
      const ean = _pmc.ean
      const values: PMCValues[] = []

      Object.keys(_pmc).filter(k => !k.includes('ean')).forEach(key => {
        const regionId = key.split('_')[1]

        const region = pmcRegions.find(pmcRegion => pmcRegion.originalId === Number(regionId))

        if (region) {

          values.push({
            ean,
            value: Number(_pmc[key]),
            region_id: new ObjectID(region._id)
          })

        }
      })

      if (!pmcValues.has(_pmc.ean.toString())) {
        pmcValues.set(_pmc.ean.toString(), values)
      }
    })

    return pmcValues
  }
}

export default PmcGetRegionValueService