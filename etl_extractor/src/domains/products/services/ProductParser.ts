import {
  Store,
  Product,
  FileRepository,
  ProductRepository,
  ShowcaseRepository,
  CategoryRepository,
  ManufacturerRepository,
  ProductControlRepository,
  ProductClassificationRepository,
} from "@mypharma/api-core"

import { IConnectionData } from "../../../interfaces/IConnectionData"
import { IInvalidate } from "../../../interfaces/IValidateProduct"
import { CreateLog } from "../../../support/helpers/Logger"
import { GenericCache } from "../helpers/GenericCache"

const allTrim = (string: string) => string.replace(/\s+/g, ' ').replace(/^\s+|\s+$/, '')

const formatString = (string: string) => allTrim(string.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, '')).replace(/\s/g, '-')

const generateSlug = async (product: Product, tenant: string) => {
  let slug = formatString(product.name)

  if (product.name && product.name.length > 0) {
    slug += `-${formatString(product.name)}`
  }

  if (product.manufacturer && product.manufacturer.name.length > 0) {
    slug += `-${formatString(product.manufacturer.name)}`
  }

  slug += `-${formatString(product.EAN)}`

  // Check if already exists
  const count = await ProductRepository.repo(tenant).count({
    where: {
      slug: [slug]
    }
  })
  if (count > 0) {
    slug += `-${count + 1}`
  }

  return slug
}

export const productFilter = async (eans: string[], tenant: string) => {
  if (eans.length <= 0) return { replicas: [], valids: [] }

  const [replicas, valids] = await Promise.all([
    ProductRepository.repo().find({
      where: {
        EAN: { $in: eans }
      },
      select: [
        '_id',
        'EAN',
        'name',
        'slug',
        'image',
        'control',
        'category',
        'description',
        'manufacturer',
        'presentation',
        'classification',
        'activePrinciple',
      ]
    }),
    ProductRepository.repo(tenant).find({
      where: {
        EAN: { $in: eans }
      },
      select: [
        '_id',
        'EAN',
        'name',
        'price',
        'erp_pmc',
        'quantity',
        'updatedAt',
        'lastStock',
        'updateOrigin',
        'presentation',
        'priceLocked',
        'quantityLocked',
        'activePrinciple',
      ]
    })

  ])

  return { replicas, valids }
}

const handleAddProduct = async (entries: IConnectionData[], valids: Product[], replicas: Product[], tenant: string, settings: Record<any, any>, userId: string) => {
  const bulkWriteProducts: any[] = []
  const bulkWriteShowcase: any[] = []
  const invalidateProducts: IInvalidate[] = []

  const mergeable = settings && settings['etlMergeableFields'] instanceof Array ? settings['etlMergeableFields'] : []

  for await (const entry of entries) {
    let manufacturer = undefined
    const lastStock = entry.quantity > 0 ? new Date() : entry.lastStock
    const extraUpdate: Record<string, string | number> = {}
    let presentation = entry.presentation && entry.presentation.length > 0 ? entry.presentation : undefined

    let product = valids.find(valid => valid.EAN.toString() === entry.EAN.toString())

    if (entry.laboratory && entry.laboratory.length > 0) {

      manufacturer = await ManufacturerRepository.repo(tenant).findOne({
        where: {
          name: entry.laboratory
        }
      })

      if (!manufacturer) {
        manufacturer = await ManufacturerRepository.repo(tenant).createDoc({
          name: entry.laboratory,
          createdAt: new Date()
        })
      }
    }

    if (!product) {
      product = new Product()
      const replica = replicas.find(replica => replica.EAN.toString() === entry.EAN.toString())

      product._id = undefined
      product.slug = []
      product.sku = null
      product.status = true
      product.category = []
      product.control = null
      product.classification = null
      product.metaTitle = ''
      product.description = ''
      product.presentation = ''
      product.metaDescription = ''
      product.priceLocked = false
      product.quantityLocked = false

      if (replica) {
        let image = null
        let category = []
        let control = null
        let classification = null

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
        }

        if (replica.control) {
          control = await GenericCache(ProductControlRepository.repo(), tenant, replica.control.originalId)
        }

        if (replica.classification) {
          classification = await GenericCache(ProductClassificationRepository.repo(), tenant, replica.classification.originalId)
        }

        if (replica.image) {
          image = await FileRepository.repo(tenant).createDoc({
            ...replica.image,
            _id: undefined,
            createdAt: new Date(),
          })
        }

        if (replica.category && replica.category.length > 0) {
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

      } else {

        product.name = entry.name
        product.EAN = entry.EAN.toString()
        product.manufacturer = manufacturer
        product.presentation = presentation
        product.category = []
        product.control = null
        product.classification = null
        product.metaTitle = `${entry.name} ${presentation ? presentation : ''}`
      }

      product.deletedAt = null
      product.createdAt = new Date()
    }

    Object.keys(entry).forEach(key => {
      if (mergeable.includes(key)) {
        if (!mergeable.includes('erp_pmc')) {
          product[key] = entry[key]
          extraUpdate[key] = entry[key]
        }
      }
    })

    if (!product.slug || product.slug.length <= 0) {
      const newSlug = await generateSlug(product, tenant)
      product.slug = [newSlug]
    }

    if (Number(entry.erp_pmc) > 0) {
      product.erp_pmc = Number(entry.erp_pmc)
    }

    if (!product.priceLocked) {
      if (Number(entry.price) > 0 && Number(entry.price) < Number(entry.erp_pmc)) {
        product.price = Number(entry.price)
      } else {
        product.price = Number(entry.erp_pmc)
      }
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
              slug: product.slug,
              price: product.price,
              erp_pmc: product.erp_pmc,
              lastStock: lastStock,
              quantity: product.quantity,
              updateOrigin: 'etl_extractor',
              updatedAt: new Date()
            }
          }
        }
      })

      let updateObj: Record<any, any> = {}

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
              'products.$.product.erp_pmc': product.erp_pmc,
              'products.$.product.lastStock': product.lastStock,
              'products.$.product.updateOrigin': 'etl_extractor',
              'products.$.product.updatedAt': new Date()
            }
          }
        }
      })

      invalidateProducts.push({
        tenant,
        ean: product.EAN.toString()
      })

    } else {
      bulkWriteProducts.push({
        insertOne: product
      })

      invalidateProducts.push({
        tenant,
        ean: product.EAN.toString()
      })

      product = null
    }

  }

  if (bulkWriteProducts.length > 0) {
    await ProductRepository.repo(tenant).bulkWrite(bulkWriteProducts)
    await CreateLog(tenant, bulkWriteProducts.length, userId)

    if (bulkWriteShowcase.length > 0) {
      await ShowcaseRepository.repo(tenant).bulkWrite(bulkWriteShowcase)
    }
  }

  return invalidateProducts
}


export const ProductParser = async (data: IConnectionData[], valids: Product[], replicas: Product[], store: Store, userId: string) => {

  const invalidate = await handleAddProduct(data, valids, replicas, store.tenant, store.settings, userId)

  return invalidate
}