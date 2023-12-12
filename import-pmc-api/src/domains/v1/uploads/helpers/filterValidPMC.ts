import { PMCData } from "../../../../interfaces/pmc";

export const filterValidPMC = (pmcs: PMCData[] = []) => {
  const pmcValues = new Map<string, PMCData>([])

  if (pmcs.length <= 0) return []

  pmcs.forEach(pmc => {
    if (
      (typeof pmc.ean !== 'undefined' && pmc.ean.length > 0) &&
      (typeof pmc.region_1 !== 'undefined' && Number(pmc.region_1) > 0) &&
      (typeof pmc.region_2 !== 'undefined' && Number(pmc.region_2) > 0) &&
      (typeof pmc.region_3 !== 'undefined' && Number(pmc.region_3) > 0) &&
      (typeof pmc.region_4 !== 'undefined' && Number(pmc.region_4) > 0) &&
      (typeof pmc.region_5 !== 'undefined' && Number(pmc.region_5) > 0)
    ) {
      if (!pmcValues.has(pmc.ean.toString())) {

        pmcValues.set(pmc.ean.toString(), pmc)
      }
    }
  })

  const filtred = Array.from(pmcValues.values())
  pmcValues.clear()

  return filtred
}