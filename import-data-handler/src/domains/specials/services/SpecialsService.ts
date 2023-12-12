import { ISpecials } from "../../../interfaces/specials"
import { ProductRepository, Store } from '@mypharma/api-core'
import { fixPromotionSpecials } from '../helpers/fixPromotionSpecials'

export const specialsService = async (specials: ISpecials[], store: Store) => {

    const tenant = store.tenant
    const { where, specialsObjPromotion } = await fixPromotionSpecials(specials)
    const productsData = await ProductRepository.repo(tenant).find(where)

    return { productsData, specialsObjPromotion }
}