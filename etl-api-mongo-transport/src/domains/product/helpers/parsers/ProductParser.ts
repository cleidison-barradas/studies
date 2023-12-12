import moment from 'moment'
import { SocketProductData } from '@mypharma/etl-engine'
import {
  Store,
  Product,
  Category,
  Manufacturer,
  ProductControl,
  FileRepository,
  ProductRepository,
  ShowcaseRepository,
  CategoryRepository,
  ProductClassification,
  ManufacturerRepository,
  ProductControlRepository,
  ProductClassificationRepository
} from '@mypharma/api-core'
import { GenericCache } from '../cache/GenericCache'
import { filterUniqueProducts } from '../filters/filterSocketProduct'

export interface InvalidateData {
  ean: string
  tenant: string
}

/**
 * Replace all whitespace with a single space, then trim the string.
 * @param {string} string - string - The string to be trimmed.
 */
const allTrim = (string: string = '') => string.replace(/\s+/g, ' ').replace(/^\s+|\s+$/, '')
/**
 * It takes a string and returns a string with all the characters in lowercase, removes all accents,
 * removes all non-alphanumeric characters, removes all whitespace, and replaces all whitespace with a
 * dash.
 * @param {string} string - The string you want to format
 */
const formatString = (string: string = '') => allTrim(string.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, '')).replace(/\s/g, '-')

/**
 * It takes a product and a store tenant and returns a slug
 * @param {Product} product - Product - The product object that we're generating the slug for.
 * @param {string} storeTenant - The tenant ID of the store.
 * @returns A string
 */
const generateSlug = async (product: Product, storeTenant: string) => {
  let slug = ''
  const productName = product.name || null
  const manufacturerName = product.manufacturer && product.manufacturer.name ? product.manufacturer.name : null

  if (productName && productName.length > 0) {
    slug += `${formatString(productName)}`
  }

  if (manufacturerName && manufacturerName.length > 0) {
    slug += `-${formatString(manufacturerName)}`
  }

  slug += `-${formatString(product.EAN)}`

  // Check if already exists
  const count = await ProductRepository.repo<ProductRepository>(storeTenant).count({
    slug: slug
  })

  if (count > 0) {
    slug += `-${count + 1}`
  }

  return slug
}


/**
 * It filters out all products that don't have a name, ean, price and quantity
 * @param {SocketProductData[]} products - SocketProductData[] - this is the array of products that
 * we're going to filter.
 * @returns An array of products that have a name, ean, price and quantity.
 */
export const validProducts = (products: SocketProductData[]) => {
  return products.filter(p =>
    (typeof p.name === 'string' && p.name.trim().length > 0) &&
    (typeof p.ean !== 'undefined' && Number(p.ean) > 0) &&
    (typeof p.price !== 'undefined' && !isNaN(p.price)) &&
    (typeof p.quantity !== 'undefined' && !isNaN(p.quantity as any))
  )
}


/**
 * It fetches all the products from the database that have the same EAN as the products that were sent
 * by the client
 * @param {SocketProductData[]} products - SocketProductData[]
 * @param {string} storeTenant - The tenant of the store that is requesting the products
 * @returns {
 *   valids: Product[],
 *   replicas: Product[]
 * }
 */
export const productsFilter = async (products: SocketProductData[], storeTenant: string): Promise<{ valids: Product[], replicas: Product[] }> => {
  let eans = products.map(p => p.ean.toString())

  if (eans.length === 0) {
    return {
      valids: [],
      replicas: []
    }
  }

  const [valids, replicas] = await Promise.all([
    ProductRepository.repo(storeTenant).find({
      where: {
        EAN: {
          $in: eans
        }
      },
      select: [
        '_id',
        'EAN',
        'name',
        'slug',
        'price',
        'erp_pmc',
        'quantity',
        'specials',
        'updatedAt',
        'lastStock',
        'updateOrigin',
        'presentation',
        'priceLocked',
        'quantityLocked',
        'activePrinciple',
      ]
    }),
    ProductRepository.repo().find({
      where: {
        EAN: {
          $in: eans
        }
      },
      select: [
        '_id',
        'EAN',
        'name',
        'image',
        'control',
        'category',
        'description',
        'metaTitle',
        'manufacturer',
        'classification',
        'metaDescription',
        'activePrinciple',
      ]
    })
  ])

  // Free memory
  eans = null

  return {
    valids,
    replicas
  }
}


/**
 * It receives a list of products, filters them by EAN, and then updates or creates them in the
 * database
 * @param {SocketProductData[]} products - SocketProductData[]
 * @param {Product[]} filtered - Products that are already in the store database
 * @param {Product[]} replicas - Product[]
 * @param {string} storeTenant - The tenant of the store
 * @param storeSettings - The settings of the store
 * @returns An array of invalidated EANs
 */
const addProductsHandler = async (products: SocketProductData[], filtered: Product[], replicas: Product[], storeTenant: string, storeSettings: Record<any, any>) => {
  const invalidateEans: InvalidateData[] = []
  const bulkWriteProduct: any[] = []
  const bulkWriteShowcase: any[] = []

  // Get merge fields
  const mergeFields = !!storeSettings.etlMergeableFields && storeSettings.etlMergeableFields instanceof Array ? storeSettings.etlMergeableFields : []

  for await (const entry of products) {
    const lastStock = Number(entry.quantity) > 0 ? new Date() : moment(entry.last_stock).toDate()
    const presentation = entry.presentation ? entry.presentation : ''
    const extraUpdate: Record<any, any> = {}
    const updateObj: Record<any, any> = {}

    let product = filtered.find(v => v.EAN.toString() === entry.ean.toString())
    let manufacturer = null

    if (entry.laboratory && entry.laboratory.length > 0) {
      manufacturer = await ManufacturerRepository.repo(storeTenant).findOne({
        where: {
          name: new RegExp(entry.laboratory.replace(/[\W_]+/g, ' '), 'i')
        }
      })

      if (!manufacturer) {
        manufacturer = await ManufacturerRepository.repo(storeTenant).createDoc({
          _id: undefined,
          name: entry.laboratory.replace(/[\W_]+/g, ' '),
          createdAt: new Date()
        })
      }
    }

    if (!product) {
      const replicaProduct = replicas.find(v => v.EAN.toString() === entry.ean.toString())

      product = new Product()

      // Get existing data from MyPharma Database
      if (replicaProduct) {
        let image = undefined
        let control = undefined
        let category = undefined
        let classification = undefined

        // Manufacturer replica
        if (!!replicaProduct.manufacturer && !manufacturer) {
          manufacturer = await GenericCache<Manufacturer>(ManufacturerRepository.repo(storeTenant), storeTenant, replicaProduct.manufacturer.originalId)

          if (!manufacturer) {
            manufacturer = await ManufacturerRepository.repo(storeTenant).createDoc({
              ...replicaProduct.manufacturer,
              _id: undefined
            })
          }
        }

        // Classification replica
        if (!!replicaProduct.classification) {
          classification = await GenericCache<ProductClassification>(ProductClassificationRepository.repo(storeTenant), storeTenant, replicaProduct.classification.originalId)

          if (!classification) {
            classification = await ProductClassificationRepository.repo(storeTenant).createDoc({
              ...replicaProduct.classification,
              _id: undefined
            })
          }
        }

        // Control replica
        if (!!replicaProduct.control) {
          control = await GenericCache<ProductControl>(ProductControlRepository.repo(storeTenant), storeTenant, replicaProduct.control.originalId)

          if (!control) {
            control = await ProductControlRepository.repo(storeTenant).createDoc({
              ...replicaProduct.control,
              _id: undefined
            })
          } ``
        }

        // Image replica
        if ((!!replicaProduct.image && !!replicaProduct.image.key) || !!replicaProduct.imageUrl) {
          const img = (!!replicaProduct.image && !!replicaProduct.image.key) ? replicaProduct.image.key : replicaProduct.imageUrl

          image = await FileRepository.repo(storeTenant).createDoc({
            name: img,
            key: img,
            url: img,
            folder: 'products'
          })
        }

        // Category replica
        if (!!replicaProduct.category) {
          category = []

          for await (const c of replicaProduct.category) {
            let _category = await GenericCache<Category>(CategoryRepository.repo(storeTenant), storeTenant, c.originalId)

            // Create category replica into store database
            if (!_category) {
              _category = await CategoryRepository.repo(storeTenant).createDoc({
                ...c,
                _id: undefined
              })
            }

            category.push({
              ..._category
            })
          }
        }

        Object.keys(replicaProduct).forEach(k => {
          if (typeof replicaProduct[k] !== 'object' && k !== '_id') {
            product[k] = replicaProduct[k]
          }
        })

        product.image = image || null
        product.control = control || null
        product.category = category || []
        product.manufacturer = manufacturer || null
        product.classification = classification || null
      } else {
        product.EAN = entry.ean.toString()
        product.name = entry.name
        product.description = ''
        product.presentation = presentation
        product.activePrinciple = entry.active_principle || null
        product.manufacturer = manufacturer || null

        // Metas
        product.metaTitle = `${entry.name}${presentation.length > 0 ? ` ${presentation}` : ''}`

        // Extra fields
        Object.keys(entry).forEach(k => {
          if (product[k] === undefined) {
            product[k] = entry[k]
          }
        })
      }

      product.slug = []
      product.height = 0
      product.length = 0
      product.weight = 0
      product.weight = 0
      product.status = true
      product._id = undefined
      product.benefit = null
      product.deletedAt = null
      product.priceLocked = false
      product.quantityLocked = false
      product.createdAt = new Date()
    }

    // Set mergeable fields
    Object.keys(entry).forEach(k => {
      // If we do have this field as mergeable, so we can set as we received from the ETL 
      if (mergeFields.includes(k) && entry[k]) {
        product[k] = entry[k]
        extraUpdate[k] = entry[k]
      }
    })

    if (!product.priceLocked) {
      product.price = Number(entry.price)
    }

    if (!product.quantityLocked) {
      product.quantity = Number(entry.quantity)
    }

    product.lastStock = lastStock
    product.updateOrigin = 'etl'

    if (!product.slug || product.slug.length === 0) {
      const newSlug = await generateSlug(product, storeTenant)
      product.slug = [newSlug]
    }

    // Filter only updatable and insertable fields
    if (product._id) {

      // Bulk write product update
      bulkWriteProduct.push({
        updateOne: {
          filter: {
            EAN: product.EAN.toString()
          },
          update: {
            '$set': {
              ...extraUpdate,
              slug: product.slug,
              price: product.price,
              quantity: product.quantity,
              updateOrigin: 'etl',
              updatedAt: new Date(),
              lastStock
            }
          }
        }
      })

      Object.keys(extraUpdate).forEach(k => {
        if (extraUpdate[k]) {
          updateObj[`products.$.product.${k}`] = extraUpdate[k]
        }
      })

      // Bulk write showcase update
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
              'products.$.product.slug': product.slug,
              'products.$.product.price': product.price,
              'products.$.product.quantity': product.quantity,
              'products.$.product.updateOrigin': 'etl',
              'products.$.product.updatedAt': new Date(),
              'products.$.product.lastStock': lastStock,
              updatedAt: new Date()
            }
          }
        }
      })

    } else {
      // Bulk write product insert
      bulkWriteProduct.push({
        insertOne: product
      })
    }

    // Add to invalidate
    invalidateEans.push({
      tenant: storeTenant,
      ean: entry.ean.toString()
    })

  }

  if (bulkWriteProduct.length > 0) {
    // Bulk
    await ProductRepository.repo(storeTenant).bulkWrite(bulkWriteProduct)

    if (bulkWriteShowcase.length > 0) {
      // Bulk showcase
      await ShowcaseRepository.repo(storeTenant).bulkWrite(bulkWriteShowcase)
    }
  }

  return invalidateEans
}

export const productParser = async (products: SocketProductData[], store: Store): Promise<InvalidateData[]> => {
  // Fix invalid products
  const productValid = validProducts(products)

  // Grab filtred products
  let { valids, replicas } = await productsFilter(productValid, store.tenant)

  // Add products to store
  const invalidateEans = await addProductsHandler(productValid, valids, replicas, store.tenant, store.settings)

  valids = null
  replicas = null

  return invalidateEans
}
