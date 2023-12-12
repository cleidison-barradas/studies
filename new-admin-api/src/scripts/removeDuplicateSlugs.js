require('dotenv').config()
const Config = require('../config')
const { ORM, ProductRepository, StoreRepository, Product, QueuePlugin } = require('@mypharma/api-core')
const { ObjectId } = require('bson')

const formatString = (string = '') =>
  allTrim(
    string.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 ]/g, '')
  )
    .replace(/\s/g, '-')

const allTrim = (string = '') => string.replace(/\s+/g, ' ').replace(/^\s+|\s+$/, '')

/**
 * It takes a product, tenant, and an array of slugs, and returns a slug
 * @param {Product} product - The product object that we're generating the slug for.
 * @param {String} tenant - The tenant object
 * @returns A function that takes in a product, tenant, and slugs and returns a slug.
 */
const generateSlug = async (product, tenant) => {
  let slug = ''
  if (product.name && product.name.length > 0) {
    slug += `${formatString(product.name)}`
  }

  if (product.manufacturer && product.manufacturer.name && product.manufacturer.name.length > 0) {
    slug += `-${formatString(product.manufacturer.name)}`
  }

  slug += `-${formatString(product.EAN)}`

  // Check if already exists
  let count = await ProductRepository.repo(tenant).count({
    slug: [slug]
  })

  if (count > 0) {
    slug += `-${count + 1}`
  }

  return slug
}

exports.default = (async () => {
  ORM.config = Config.databases.mongoConfig
  await ORM.setup()

  await QueuePlugin.init(Config.amqpHost)
  await QueuePlugin.start('mongo-invalidate-product')

  const stores = await StoreRepository.repo().find({
    select: ['tenant']
  })

  const tenants = stores.map(store => store.tenant)

  for await (const tenant of tenants) {
    try {
      const slugs = []
      const eans = []
      const invalidate = []
      const bulkWriteProduct = []

      await ORM.setup(null, tenant)

      const grouping = await ProductRepository.repo(tenant).aggregate([
        {
          "$group": {
            "_id": { "slugs": "$slug" },
            "eans": { "$addToSet": "$EAN" },
            "total": { "$sum": 1 }
          }
        },
        { "$match": { "total": { "$gt": 1 } } }
      ]).toArray()

      grouping.forEach(group => {
        eans.push(...group.eans)
      })

      if (eans.length > 0) {

        await ProductRepository.repo(tenant).updateMany({ EAN: { $in: eans } }, { $set: { slug: [] } })

        const products = await ProductRepository.repo(tenant).find({
          where: {
            slug: []
          },
          select: ['_id', 'slug', 'name', 'EAN', 'manufacturer']
        })

        for await (const product of products) {
          const slug = await generateSlug(product, tenant, slugs)

          bulkWriteProduct.push({
            updateOne: {
              filter: {
                _id: new ObjectId(product._id)
              },
              update: {
                '$set': {
                  slug: [slug],
                  updatedAt: new Date()
                }
              }
            }
          })

          invalidate.push({
            tenant,
            ean: product.EAN,
          })
        }

        if (bulkWriteProduct.length > 0) {
          const response = await ProductRepository.repo(tenant).bulkWrite(bulkWriteProduct)
          await QueuePlugin.publish('mongo-invalidate-product', invalidate)
          console.log(`modified: ${response.modifiedCount} slugs`)
        }
        console.log(`terminated ${tenants.indexOf(tenant) + 1} of ${tenants.length}`)
      }
    } catch (error) {
      console.log(error)
    }
  }
  console.log('finished')
  process.exit(0)

})()
