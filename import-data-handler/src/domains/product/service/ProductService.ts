import {
  Store,
  Product,
  ObjectID,
  Category,
  Manufacturer,
  FileRepository,
  ProductControl,
  ProductRepository,
  CategoryRepository,
  ManufacturerRepository,
  ProductClassification,
  ProductControlRepository,
  ProductClassificationRepository
} from "@mypharma/api-core"

import { InvalidateCache } from "../../../interfaces/invalidate"
import { IProduct } from "../../../interfaces/product"

import { filterValidProducts } from "../helpers/filterValidProductsHelper"
import { generateSlug } from "../helpers/generateSlugHelper"

import { GenericCache } from "../../../support/cache/GenericCache"
import RedisPlugin from "../../../support/plugins/redis"

import ShowCaseBulkWriteService from '../../showCase/services/ShowCaseBulkWriteService'
import ProductBulkWriteService from '../../product/service/ProductBulkWriteService'

const productBulkWriteService = new ProductBulkWriteService()
const showCaseBulkWriteService = new ShowCaseBulkWriteService()

const addProductHandler = async (products: IProduct[], valids: Product[], replicas: Product[], store: Store) => {
  const tenant = store.tenant
  const storeSettings = store.settings
  const bulkWriteProducts: any[] = []
  const bulkWriteShowcase: any[] = []
  const invalidateCache: InvalidateCache[] = []

  // Get model properties
  const { metadata } = ProductRepository.repo(tenant)

  const modelProperties = Object.keys(metadata.propertiesMap)

  // Get merge fields
  const mergeFields = !!storeSettings.etlMergeableFields && storeSettings.etlMergeableFields instanceof Array ? Array.from<string>(storeSettings.etlMergeableFields) : []

  for await (const entry of products) {
    const extraUpdate: Record<string, any> = {}
    let manufacturer: Manufacturer | null = null
    let presentation = entry.presentation && entry.presentation.length > 0 ? entry.presentation : ''

    let product = valids.find(_product => _product.EAN === entry.EAN)

    if (entry.laboratory && entry.laboratory.length > 0) {
      manufacturer = await ManufacturerRepository.repo(tenant).findOne({
        where: {
          name: new RegExp(entry.laboratory.replace(/[\W_]+/g, ' '), 'i')
        }
      })

      if (!manufacturer) {
        manufacturer = await ManufacturerRepository.repo(tenant).createDoc({
          name: entry.laboratory.replace(/[\W_]+/g, ' '),
          createdAt: new Date()
        })
      }
      manufacturer._id = new ObjectID(manufacturer._id)
    }

    if (!product) {
      const replica = replicas.find(_replica => _replica.EAN === entry.EAN)

      product = new Product()

      product._id = undefined
      product.MS = ''
      product.sku = ''
      product.slug = []
      product.erp_pmc = 0
      product.status = true
      product.benefit = null
      product.description = ''
      product.presentation = ''
      product.activePrinciple = ''
      product.priceLocked = false
      product.quantityLocked = false
      product.metaTitle = ''
      product.metaDescription = ''
      product.deletedAt = null
      product.createdAt = new Date()

      if (replica) {

        let image = null
        let category: Category[] = []
        let control: ProductControl | null = null
        let classification: ProductClassification | null = null

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

          manufacturer._id = new ObjectID(manufacturer._id)
        }

        if (!!replica.control) {
          control = await GenericCache(ProductControlRepository.repo(), tenant, replica.control.originalId)
          control._id = new ObjectID(control._id)
        }

        if (!!replica.classification) {
          classification = await GenericCache(ProductClassificationRepository.repo(), tenant, replica.classification.originalId)
          classification._id = new ObjectID(classification._id)
        }

        if (!!replica.image) {
          image = await FileRepository.repo(tenant).createDoc({
            ...replica.image,
            _id: undefined,
            createdAt: new Date(),
          })
        }

        if (!!replica.category && replica.category.length > 0) {
          let _category = null
          category = []

          for await (const cat of replica.category) {
            _category = await GenericCache(CategoryRepository.repo(tenant), tenant, cat.originalId)

            if (!_category) {
              _category = await CategoryRepository.repo(tenant).createDoc({
                ...cat,
                _id: undefined,
                status: false,
                subCategories: [],
                createdAt: new Date()
              })
            }

            _category = { ..._category, _id: new ObjectID(_category._id) }

            category.push({
              ..._category
            })
          }
        }

        Object.keys(replica).forEach(key => {
          if (typeof replica[key] !== 'object' && !key.includes('_id')) {
            product[key] = replica[key]
          }
        })

        product.image = image
        product.control = control
        product.category = category
        product.manufacturer = manufacturer
        product.classification = classification

      } else if (entry.name && entry.name.length > 0) {

        product.name = entry.name
        product.EAN = entry.EAN.toString()
        product.manufacturer = manufacturer
        product.presentation = presentation
        product.category = []
        product.control = null
        product.classification = null
        product.metaTitle = `${entry.name} ${presentation ? presentation : ''}`
      }
    }
    const lastStock = product.quantity > 0 ? new Date() : product.lastStock

    // Set mergeable fields
    Object.keys(entry).forEach(k => {
      const field = mergeFields.find(mergeble => mergeble.toLowerCase() === k.toLowerCase())
      // If we do have this field as mergeable, so we can set as we received
      if (field) {

        if (modelProperties.indexOf(field) !== -1) {
          product[field] = entry[k]
          extraUpdate[field] = entry[k]
        }
      }
    })

    if (!product.slug || product.slug.length <= 0) {
      const newSlug = await generateSlug(product, tenant)
      product.slug = [newSlug]
    }

    if (!product.priceLocked) {
      product.price = Number(entry.price)
    }

    if (!product.quantityLocked) {
      product.quantity = Number(entry.quantity)
    }

    if (product._id) {
      bulkWriteProducts.push({
        updateOne: {
          filter: { EAN: product.EAN.toString() },
          update: {
            '$set': {
              ...extraUpdate,
              lastStock,
              slug: product.slug,
              price: product.price,
              quantity: product.quantity,
              updateOrigin: 'xls',
              updatedAt: new Date()
            }
          }
        }
      })

      let updateObj: Record<string, any> = {}

      Object.keys(extraUpdate).forEach(k => {
        updateObj[`products.$.product.${k}`] = extraUpdate[k]
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
              'products.$.product.lastStock': product.lastStock,
              'products.$.product.updateOrigin': 'xls',
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
        insertOne: product
      })

      invalidateCache.push({
        tenant,
        ean: product.EAN.toString()
      })
    }
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

export const productService = async (products: IProduct[], store: Store) => {
  let { valids, replicas } = await filterValidProducts(products, store.tenant)

  const { invalidateCache, modifiedCount } = await addProductHandler(products, valids, replicas, store)

  valids = []
  replicas = []

  return {
    modifiedCount,
    invalidateCache
  }

}