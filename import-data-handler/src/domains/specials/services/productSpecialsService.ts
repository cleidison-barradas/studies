import { Product, Store } from "@mypharma/api-core"
import { InvalidateCache } from "../../../interfaces/invalidate"
import { ISpecials } from "../../../interfaces/specials"
import ProductBulkWriteService from "../../product/service/ProductBulkWriteService"
import ShowCaseBulkWriteService from "../../showCase/services/ShowCaseBulkWriteService"
import { fixDiscountSpecials } from "../helpers/fixDiscountSpecials"

const productBulkWriteService = new ProductBulkWriteService()
const showCaseBulkWriteService = new ShowCaseBulkWriteService()

export const addProductsSpecialsHandler = async (products: Product[], specials: ISpecials[], specialsObjPromotion: {}, store: Store) => {

    const tenant = store.tenant
    const bulkWriteProducts: any[] = []
    const bulkWriteShowcase: any[] = []
    const invalidateCache: InvalidateCache[] = []

    for await (const entry of specials) {

        entry.typeDiscount = specialsObjPromotion['typeDiscount']

        for await (const product of products) {

            const specials = []
            const { specialsObjDiscount } = fixDiscountSpecials(product, entry)

            const specialsObj = { ...specialsObjPromotion, ...specialsObjDiscount }

            specials.push(specialsObj)

            bulkWriteProducts.push({
                updateOne: {
                    filter: { EAN: product.EAN.toString() },
                    update: {
                        '$set': { specials }
                    },
                    upsert: true,
                }
            })

            bulkWriteShowcase.push({
                updateMany: {
                    filter: {
                        products: {
                            $elemMatch: {
                                'product.EAN': product.EAN.toString()
                            }
                        }
                    },
                    update: {
                        '$set': {
                            'products.$.product.specials': specials,
                            updateAt: new Date()
                        }
                    },
                }
            })

            invalidateCache.push({
                tenant,
                ean: product.EAN.toString()
            })
        }
    }

    if (bulkWriteProducts.length > 0) {

        const { modifiedCount } = await productBulkWriteService.bulkWriteProduct({ tenant, bulkWrite: bulkWriteProducts })

        if (bulkWriteShowcase.length > 0) {

            await showCaseBulkWriteService.bulkWriteShowCase({ tenant, bulkWrite: bulkWriteShowcase })
        }

        return {
            modifiedCount,
            invalidateCache
        }
    }

    return {
        modifiedCount: 0,
        invalidateCache: []
    }
}

export const productsSpecialsService = async (products: Product[], specials: ISpecials[], specialsObjPromotion: {}, store: Store) => {

    const { modifiedCount, invalidateCache } = await addProductsSpecialsHandler(products, specials, specialsObjPromotion, store)

    return { modifiedCount, invalidateCache }
}