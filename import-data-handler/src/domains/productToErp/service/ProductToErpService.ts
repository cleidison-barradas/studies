import {
  Store,
  ObjectID,
  Product,
  FileRepository,
  ProductControlRepository,
  ManufacturerRepository,
  ProductClassificationRepository,
  CategoryRepository
} from "@mypharma/api-core"
import { IProductToErp } from "../../../interfaces/productToErp"
import { filterValidProducts } from "../helpers/filterValidProductsHelper"
import { InvalidateCache } from "../../../interfaces/invalidate"
import { GenericCache } from "../../../support/cache/GenericCache"
import { formatString, generateSlug } from "../helpers/generateSlugHelper"
import { specialPrice } from "../helpers/specialPrice"
import RedisPlugin from "../../../support/plugins/redis"
import ShowCaseBulkWriteService from '../../showCase/services/ShowCaseBulkWriteService'
import ProductBulkWriteService from '../../product/service/ProductBulkWriteService'

const productBulkWriteService = new ProductBulkWriteService()
const showCaseBulkWriteService = new ShowCaseBulkWriteService()

const addProductHandler = async (products: IProductToErp[], valids: Product[], replicas: Product[], store: Store) => {
  const tenant = store.tenant
  const storeSettings = store.settings
  const bulkWriteProducts: any[] = []
  const bulkWriteShowcase: any[] = []
  const invalidateCache: InvalidateCache[] = []

  // Get merge fields
  const mergeable = !!storeSettings.etlMergeableFields && storeSettings.etlMergeableFields instanceof Array ? Array.from<string>(storeSettings.etlMergeableFields) : []

  for await (const entry of products) {
    let manufacturer = null
    let updateObj: Record<any, any> = {}
    const presentation = entry.presentation || ''

    const extraUpdate: Record<string, string | number> = {}
    let lastStock = entry.quantity && entry.quantity > 0 ? new Date() : null

    let product = valids.find(_product => _product.EAN === entry.EAN)

    if (entry.manufacturer && entry.manufacturer.length > 0) {
      manufacturer = await ManufacturerRepository.repo(tenant).findOne({
        where: {
          name: new RegExp(entry.manufacturer.replace(/[\W_]+/g, ' '), 'i')
        }
      })

      if (!manufacturer) {
        manufacturer = await ManufacturerRepository.repo(tenant).createDoc({
          _id: undefined,
          name: entry.manufacturer.replace(/[\W_]+/g, ' '),
          createdAt: new Date()
        })
      }
    }

    if (!product) {
      const replica = replicas.find(r => r.EAN.toString() === entry.EAN.toString())
      product = new Product()

      if (replica) {
        let image = undefined
        let control = undefined
        let category = undefined
        let manufacturer = undefined
        let classification = undefined

        if (replica.manufacturer && replica.manufacturer.name.length > 0 && !manufacturer) {
          manufacturer = await GenericCache(ManufacturerRepository.repo(tenant), tenant, replica.manufacturer.originalId)

          if (!manufacturer) {
            manufacturer = await ManufacturerRepository.repo(tenant).createDoc({
              ...replica.manufacturer,
              _id: undefined,
              createdAt: new Date(),
              updatedAt: new Date()
            })
          }
          if (manufacturer) manufacturer = { ...manufacturer, _id: new ObjectID(manufacturer._id) }
        }

        if (replica.control) {
          control = await GenericCache(ProductControlRepository.repo(), tenant, replica.control.originalId)

          if (control) control = { ...control, _id: new ObjectID(control._id) }
        }

        if (replica.image) {

          image = await FileRepository.repo(tenant).createDoc({
            ...replica.image,
            _id: undefined,
            updatedAt: new Date(),
            createdAt: new Date()
          })
        }

        if (replica.classification) {
          classification = await GenericCache(ProductClassificationRepository.repo(), tenant, replica.classification.originalId)

          if (classification) classification = { ...classification, _id: new ObjectID(classification._id) }
        }

        if (replica.category && replica.category.length > 0) {
          category = []
          let _category: any = null

          for await (const categoryBase of replica.category) {

            if (categoryBase.originalId) {
              _category = await GenericCache(CategoryRepository.repo(tenant), tenant, categoryBase.originalId)

              if (!_category) {
                _category = await CategoryRepository.repo(tenant).createDoc({
                  ...categoryBase,
                  _id: undefined,
                  status: true,
                  updatedAt: new Date(),
                  createdAt: new Date()
                })
              }

              if (_category) {
                _category = { ..._category, _id: new ObjectID(_category._id), status: true }

                category.push({
                  ..._category
                })
              }
            }
          }
        }

        Object.keys(replica).forEach(key => {
          if (typeof replica[key] !== 'object' && !key.includes('_id')) {
            product[key] = replica[key]
          }
        })

        product.image = image || null
        product.control = control || null
        product.category = category || []
        product.manufacturer = manufacturer || null
        product.classification = classification || null

      } else {
        product.EAN = entry.EAN.toString()
        product.name = entry.name
        product.category = []
        product.control = null
        product.description = ''
        product.manufacturer = null
        product.classification = null
        product.presentation = presentation
        product.metaTitle = `${entry?.name} ${presentation ? presentation : ''}`
      }

      product.status = true
      product._id = undefined
      product.deletedAt = null
      product.updateOrigin = 'erp-api'
      product.priceLocked = false
      product.quantityLocked = false
      product.createdAt = new Date()
    }

    if (mergeable.includes('name') && entry.name) {
      if (formatString(product.name) !== formatString(entry.name)) {
        const newSlug = await generateSlug(product, tenant)
        product.slug = [newSlug]
        updateObj[`products.$.product.slug`] = [newSlug]
      }
    }

    Object.keys(entry).forEach(key => {
      if (mergeable.includes(key) && entry[key]) {
        product[key] = entry[key]
        extraUpdate[key] = entry[key]
      }
    })

    if (!product.slug || product.slug.length <= 0) {
      const newSlug = await generateSlug(product, tenant)
      product.slug = [newSlug]
      updateObj[`products.$.product.slug`] = [newSlug]
    }

    if (!product.priceLocked && Object.keys(entry).includes('price')
      && entry.price > 0) {
      product.price = Number(entry.price)
    }

    if (!product.quantityLocked && Object.keys(entry).includes('quantity')) {
      product.quantity = Number(entry.quantity)
    }

    if (Object.keys(entry).includes('specials') && entry.specials > 0) {
      product.specials = specialPrice(entry.specials, product.price)
    }

    if (product._id) {

      bulkWriteProducts.push({
        updateOne: {
          filter: { EAN: product.EAN.toString() },
          update: {
            '$set': {
              ...extraUpdate,
              slug: product.slug,
              price: product.price,
              specials: product.specials || [],
              lastStock: lastStock || product.lastStock,
              quantity: product.quantity,
              updateOrigin: 'erp_api',
              updatedAt: new Date()
            }
          }
        }
      })

      Object.keys(extraUpdate).forEach(k => {
        if (extraUpdate[k]) {
          updateObj[`products.$.product.${k}`] = extraUpdate[k]
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
              ...updateObj,
              'products.$.product.price': product.price,
              'products.$.product.quantity': product.quantity,
              'products.$.product.specials': product.specials || [],
              'products.$.product.lastStock': lastStock || product.lastStock,
              'products.$.product.updateOrigin': 'erp_api',
              'products.$.product.updatedAt': new Date()
            }
          }
        }
      })

      invalidateCache.push({
        tenant,
        ean: product.EAN.toString()
      })

    } else {
      bulkWriteProducts.push({
        insertOne: { ...product }
      })

      invalidateCache.push({
        tenant,
        ean: product.EAN.toString()
      })
    }
    product = null
  }

  if (bulkWriteProducts.length > 0) {
    const response = await productBulkWriteService.bulkWriteProduct({ tenant, bulkWrite: bulkWriteProducts })

    if (bulkWriteShowcase.length > 0) {
      await RedisPlugin.delete(`showcase:${store._id}`)
      await showCaseBulkWriteService.bulkWriteShowCase({ tenant, bulkWrite: bulkWriteShowcase })
    }

    const modifiedCount = response.matchedCount + response.insertedCount

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

export const productToErpService = async (products: IProductToErp[], store: Store) => {
  let { valids, replicas } = await filterValidProducts(products, store.tenant)

  const { invalidateCache, modifiedCount } = await addProductHandler(products, valids, replicas, store)

  valids = []
  replicas = []

  return {
    modifiedCount,
    invalidateCache
  }

}
