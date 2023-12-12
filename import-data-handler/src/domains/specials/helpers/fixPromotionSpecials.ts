import { ObjectId } from "bson"
import { ISpecials } from "../../../interfaces/specials"
import moment from "moment"

export const fixPromotionProduct = (entry: ISpecials) => {

    let productObjPromotion = {}
    let whereProduct = {}
    if (entry.typePromotion === 'product') {
        productObjPromotion['typeDiscount'] = entry.typeDiscount
        whereProduct = {
            ...whereProduct,
            $or: [
                {
                    '_id': {
                        $in: entry.products
                    }
                }, {
                    '_id': {
                        $in: entry.products.map(id => new ObjectId(id))
                    }
                }]
        }
    }
    return { whereProduct, productObjPromotion }
}

export const fixPromotionCategory = (entry: ISpecials) => {

    let categoryObjPromotion = {}
    let whereCategory = {}
    let searchIds = []

    if (entry.typePromotion === 'category' && entry.category.length > 0) {
        categoryObjPromotion['category'] = entry.category
        categoryObjPromotion['typeDiscount'] = 'discountPromotion'
        searchIds = entry.category.map((item: { _id: string }) => item._id)

        if (entry.AllChecked === true && entry.quantityBlock === true) {
            categoryObjPromotion['quantityBlock'] = entry.quantityBlock
            categoryObjPromotion['AllChecked'] = entry.AllChecked
            whereCategory = {
                ...whereCategory,
                quantity: { $gt: 0 },
                'category._id': { $exists: true }

            }
        }

        if (entry.AllChecked === true && entry.quantityBlock === false) {
            categoryObjPromotion['AllChecked'] = entry.AllChecked
            whereCategory = {
                ...whereCategory,
                'category._id': { $exists: true }

            }
        }

        if (entry.AllChecked === false && entry.quantityBlock === true) {
            categoryObjPromotion['quantityBlock'] = entry.quantityBlock
            whereCategory = {
                ...whereCategory,
                quantity: { $gt: 0 },
                category: {
                    $elemMatch: {
                        $or: [
                            {
                                _id: {
                                    $in: searchIds
                                }
                            }, {
                                _id: {
                                    $in: searchIds.map(id => new ObjectId(id))
                                }
                            }]
                    }
                }
            }
        }

        if (entry.AllChecked === false && entry.quantityBlock === false) {
            whereCategory = {
                ...whereCategory,
                category: {
                    $elemMatch: {
                        $or: [
                            {
                                _id: {
                                    $in: searchIds
                                }
                            }, {
                                _id: {
                                    $in: searchIds.map(id => new ObjectId(id))
                                }
                            }]
                    }
                }
            }
        }
    }
    return { whereCategory, categoryObjPromotion }
}

export const fixPromotionClassification = (entry: ISpecials) => {

    let classicationObjPromotion = {}
    let whereClassification = {}
    let searchIds = []

    if (entry.typePromotion === 'classification' &&
        entry.classification.length > 0) {
        classicationObjPromotion['classification'] = entry.classification
        classicationObjPromotion['typeDiscount'] = 'discountPromotion'
        searchIds = entry.classification.map((item: { _id: string }) => item._id)

        if (entry.AllChecked === true && entry.quantityBlock == true) {
            classicationObjPromotion['quantityBlock'] = entry.quantityBlock
            classicationObjPromotion['AllChecked'] = entry.AllChecked
            whereClassification = {
                ...whereClassification,
                quantity: { $gt: 0 },
                'classification._id': { $exists: true }
            }
        }

        if (entry.AllChecked === true && entry.quantityBlock === false) {
            classicationObjPromotion['AllChecked'] = entry.AllChecked
            whereClassification = {
                ...whereClassification,
                'classification._id': { $exists: true }
            }
        }

        if (entry.AllChecked == false && entry.quantityBlock === true) {
            classicationObjPromotion['quantityBlock'] = entry.quantityBlock
            whereClassification = {
                ...whereClassification,
                quantity: { $gt: 0 },
                $or: [
                    {
                        'classification._id': {
                            $in: searchIds
                        }
                    }, {
                        'classification._id': {
                            $in: searchIds.map(id => new ObjectId(id))
                        }
                    }]
            }
        }

        if (entry.AllChecked === false && entry.quantityBlock === false) {
            whereClassification = {
                ...whereClassification,
                $or: [
                    {
                        'classification._id': {
                            $in: searchIds
                        }
                    }, {
                        'classification._id': {
                            $in: searchIds.map(id => new ObjectId(id))
                        }
                    }]
            }
        }

    }

    return { whereClassification, classicationObjPromotion }
}

export async function fixPromotionSpecials(specials: ISpecials[]) {

    for await (const entry of specials) {

        let specialsObjPromotion = {}
        let where = {}

        const { whereProduct, productObjPromotion } = fixPromotionProduct(entry)
        const { whereCategory, categoryObjPromotion } = fixPromotionCategory(entry)
        const { whereClassification, classicationObjPromotion } = fixPromotionClassification(entry)

        where = { ...whereProduct, ...whereCategory, ...whereClassification }
        specialsObjPromotion = { ...productObjPromotion, ...categoryObjPromotion, ...classicationObjPromotion }

        specialsObjPromotion['typePromotion'] = entry.typePromotion
        specialsObjPromotion['date_start'] = moment(new Date(entry.date_start)).startOf('day').toDate()
        specialsObjPromotion['date_end'] = moment(new Date(entry.date_end)).endOf('day').toDate()

        return { where, specialsObjPromotion }
    }
}