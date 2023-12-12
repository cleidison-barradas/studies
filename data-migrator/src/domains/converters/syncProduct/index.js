const { ObjectId } = require('bson')
const rdSync = require('readline-sync')
const { logger, colors } = require('@mypharma/api-core')

const { getCategoryByOriginalId, getMongoMainCategories, bulkCategory, getMongoCategoryByParentId, deleteCategories, getCategoryByOriginalIds } = require('../../category/services/category.service')
const { getProducts, bulkProducts } = require('../../product/services/product.service')
const ProductRepository = require('../../product/repository/ProductRepository')
const CategoryRepository = require('../../category/repository/CategoryRepository')

let page = 1
let limit = 1000
let totalPages = 0
let bulkWriteProducts = []
const whiteList = [109, 110, 112, 111, 113, 114, 116, 119, 207, 208]

const key = () => {
  return {
    name: 'normalizar categorias e produtos',
    operation: 'sync_products'
  }
}

const handleCategory = async (tenant, categories = []) => {
  let BulkInsertWrite = []
  let BulkUpdateWrite = []

  if (categories.length > 0) {
    for await (let category of categories) {
      const _category = await getCategoryByOriginalId(tenant, category.originalId)

      if (!_category) {

        BulkInsertWrite.push({
          insertOne: {
            'document': category
          }
        })
      }
    }

    if (BulkInsertWrite.length > 0) {
      await bulkCategory(tenant, BulkInsertWrite)
      const mainPopulate = await getMongoMainCategories(tenant)

      for await (update of mainPopulate) {
        const subCategories = await getMongoCategoryByParentId(tenant, update.originalId)

        if (subCategories.length > 0) {
          BulkUpdateWrite.push({
            updateOne: {
              filter: { _id: ObjectId(update._id) },
              update: {
                '$set': {
                  subCategories
                }
              }
            }
          })
        }
      }

      if (BulkUpdateWrite.length > 0) {
        await bulkCategory(tenant, BulkUpdateWrite)
        await deleteCategories(tenant, whiteList)
      }
    }
  }
}

const handleProducts = async (tenant) => {
  let totalProcessed = 0
  do {
    let { products, total } = await getProducts(tenant, limit, page)
    if (products.length > 0) {

      for await (const product of products) {
        const categoryIds = await ProductRepository.productCategories(product.originalId)

        if (categoryIds.length > 0) {
          const originalIds = categoryIds.map(id => id.category_id)

          const category = await getCategoryByOriginalIds(tenant, originalIds)

          if (category.length > 0) {
            bulkWriteProducts.push({
              updateOne: {
                filter: { EAN: product.EAN },
                update: {
                  '$set': {
                    category,
                    updatedAt: new Date()
                  }
                }
              }
            })
          }
        }
      }
    }

    products = []
    page = Number(page + 1)
    totalPages = Number(total)

    console.log(`read ${page} from ${totalPages}`)

    if (bulkWriteProducts.length > 0) {
      const { modifiedCount } = await bulkProducts(tenant, bulkWriteProducts)
      bulkWriteProducts = []
      totalProcessed += modifiedCount
    }

  } while (page < totalPages)

  console.log(`finished products ${totalProcessed} updated on ${tenant}`)
  page = 1
  totalPages = 0
  totalProcessed = 0
}

const handle = async () => {
  try {
    const tenant = rdSync.question('Enter with tenant = ')

    if (!tenant.trim()) {
      logger('tenant_not_provided', colors.FgRed)

      return await handle()
    }
    logger('init process on categories...', colors.FgCyan)
    const categories = await CategoryRepository.findAll()
    await handleCategory(tenant, categories)

    logger('init process on products...', colors.FgCyan)
    await handleProducts(tenant)

  } catch (error) {
    console.log(error)
  }
}

module.exports = { key, handle }
