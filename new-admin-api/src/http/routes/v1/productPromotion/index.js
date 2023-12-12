const router = require('express').Router()
const { QueuePlugin } = require('@mypharma/api-core')
const moment = require('moment')
const { v4 } = require('uuid')

const { QueuePluginHandler } = require('../../../../plugins/queues/index.js')
const { bulkWriteSpecials } = require('./services/bulkWriteSpecials.js')
const { specialsParser } = require('./services/specialsParser.js')
const { handleSpecials } = require('./services/specialsHandle.js')
const { getModelByTenant } = require('myp-admin/database/mongo')
const { paginationParser } = require('myp-admin/helpers')
const RedisService = require('myp-admin/services/redis')
const { affiliateCheck } = require('myp-admin/http/middlewares/affiliate.middleware.js')

router.get('/promotion/:id?', async (req, res) => {
  const Product = getModelByTenant(req.tenant, 'ProductSchema')
  const { id } = req.params
  const { limit = 20, page = 1, query = null } = req.query
  let filter = {}

  try {
    if (id) {
      let promotion = await Product.findById(id)

      if (!promotion) {
        return res.status(404).json({
          error: 'promotion_not_found',
        })
      }

      return res.json({
        promotion,
      })
    }

    const paginationOptions = {
      limit,
      page,
    }

    query ? (filter['$or'] = [{ name: new RegExp(query, 'gi') }, { EAN: new RegExp(query, 'gi') }]) : ''

    filter = {
      ...filter,
      ['specials']: { $elemMatch: { $exists: true } },
    }
    const pagination = await Product.paginate(filter, paginationOptions)

    return res.json(paginationParser('promotions', pagination))
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error',
    })
  }
})

router.put('/promotion', affiliateCheck('PROMOTION', 'CREATE'), async (req, res) => {
  const Product = getModelByTenant(req.tenant, 'ProductSchema')
  const Showcase = getModelByTenant(req.tenant, 'ShowCaseSchema')
  let { typeDiscount = 'pricePromotion', category = [],
    classification = [], products = [],
    product = null, price = 0, discountPercentage = 0,
    typePromotion = 'product', date_start = new Date(),
    date_end = new Date(), quantityBlock = false, AllChecked = false } = req.body

  const promises = []
  const invalidateEans = []

  try {

    if (product && typePromotion === 'product') {

      const bulkWriteProduct = []
      const bulkWriteShowCase = []
      const specials = []
      const byProduct = await Product.find({ '_id': product._id }, { _id: 1, price: 1, EAN: 1 })

      byProduct.forEach(product => {

        const { specialsObj } = specialsParser({
          product, typePromotion, typeDiscount,
          discountPercentage, price, date_start, date_end
        })

        specials.push(specialsObj)

        const { bulkWriteProductParser, bulkWriteShowCaseParser } = bulkWriteSpecials({ product, specials })
        bulkWriteProduct.push(...bulkWriteProductParser)
        bulkWriteShowCase.push(...bulkWriteShowCaseParser)

        invalidateEans.push({
          tenant: req.tenant,
          ean: product.EAN
        })
      })

      if (bulkWriteProduct.length > 0) {
        await Product.bulkWrite(bulkWriteProduct)
        await Showcase.bulkWrite(bulkWriteShowCase)

      }

      await QueuePlugin.publish("mongo-invalidate-product", invalidateEans)
      await RedisService.remove(`showcase:${req.store}`)

      // check if store is a head store
      if (req.flagship_store && Array(req.tenants || []).length > 0) {
        product.specials = specials || []

        req.tenants.forEach(tenant => {
          const affiliate = tenant
          const action = req.action
          const entity = req.entity
          const mainStore = req.tenant

          promises.push(QueuePlugin.publish('affiliate-store-change', { affiliate, mainStore, data: product, action, entity }))
        })

        await Promise.all(promises)
      }

      return res.status(201).json({
        promotion: product,
      })

    } else {

      const tenant = req.tenant
      const action = 'specials'
      const redisKey = `${v4()}-${tenant}`

      const specials = []
      const { ids, specialsObj } = handleSpecials({
        typePromotion, typeDiscount,
        products, category, classification, price, discountPercentage,
        AllChecked, quantityBlock, date_start, date_end
      })

      specials.push(specialsObj)

      const inserted = await RedisService.set(redisKey, specials)

      if (inserted.includes('OK')) {

        const expiresAt = moment().add('1', 'hour').unix()
        await QueuePluginHandler.publish('handle-process-service-specials', { redisKey, action, tenant })
        await RedisService.expireAt(redisKey, expiresAt)
      }
      return res.status(201).json({ promotion: ids })
    }
  } catch (err) {
    if (err.message) {
      console.error(err)
      return res.status(500).json({ error: err.message })
    }
    console.error(err)
    return res.status(500).json({ err })
  }
})

router.delete('/promotion/:id', affiliateCheck('PROMOTION', 'DELETE'), async (req, res) => {
  const Product = getModelByTenant(req.tenant, 'ProductSchema')
  const Showcase = getModelByTenant(req.tenant, 'ShowCaseSchema')
  const { id } = req.params

  try {
    const promises = []
    const invalidate = []
    const bulkWriteShowCase = []

    let promotion = await Product.findById(id)

    if (!promotion) {
      return res.status(404).json({
        error: 'promotion_not_found',
      })
    }

    await promotion.updateOne({
      specials: [],
    })

    bulkWriteShowCase.push({
      updateMany: {
        filter: {
          products: {
            $elemMatch: {
              'product.EAN': { $in: [promotion.EAN, promotion.EAN.toString()] }
            }
          }
        },
        update: {
          '$set': {
            'products.$.product.specials': [],
            updatedAt: new Date()
          }
        }
      }
    })

    invalidate.push({
      ean: promotion.EAN,
      tenant: req.tenant
    })

    await Showcase.bulkWrite(bulkWriteShowCase)
    await QueuePlugin.publish('mongo-invalidate-product', invalidate)

    promotion = await Product.findById(id)

    // check if store is a head store
    if (req.flagship_store && Array(req.tenants || []).length > 0) {

      req.tenants.forEach(tenant => {
        const affiliate = tenant
        const action = req.action
        const entity = req.entity
        const mainStore = req.tenant

        promises.push(QueuePlugin.publish('affiliate-store-change', { affiliate, mainStore, data: promotion, action, entity }))
      })

      await Promise.all(promises)
    }

    return res.json({
      deletedId: id,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error',
    })
  }
})

module.exports = router
