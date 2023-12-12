import { IPromotion } from "../../../interfaces/promotion";

interface RequestFilterPromotionValidDTO {
  entries: IPromotion[]
}

export function filterPromotionValid({ entries }: RequestFilterPromotionValidDTO) {

  return entries.filter(entry =>
    typeof entry.EAN !== 'undefined' &&
    entry.EAN.length > 0 &&
    typeof entry.price === 'number')
}