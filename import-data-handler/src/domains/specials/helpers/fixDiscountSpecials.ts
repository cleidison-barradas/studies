import { Product } from "@mypharma/api-core"
import { ISpecials } from "../../../interfaces/specials"


export function fixDiscountSpecials(product: Product, entry: ISpecials) {

    let specialsObjDiscount = {}

    if (entry.typeDiscount === 'pricePromotion' && entry.price > 0) {

        specialsObjDiscount['price'] = Number(entry.price)
    }

    if (entry.typeDiscount === 'discountPromotion' && entry.discountPercentage > 0) {

        specialsObjDiscount['price'] = Number((Number(product.price) -
            (Number(product.price) * (Number(entry.discountPercentage) / 100))).toFixed(2))
        specialsObjDiscount['discountPercentage'] = Number(entry.discountPercentage)

    }

    return { specialsObjDiscount }
}
