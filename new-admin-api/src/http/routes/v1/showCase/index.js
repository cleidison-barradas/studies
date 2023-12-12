// Router
const router = require('express').Router()
const { ObjectId } = require('bson')
const moment = require('moment')
const axios = require('axios')

// Helpers
const { paginationParser, updateFieldsParser, getOriginalId } = require('myp-admin/helpers')
const fileHelper = require('../../../../utils/fileHelper')
const { put } = require('myp-admin/services/aws')
const { QueuePlugin } = require('@mypharma/api-core')
const RedisService = require('myp-admin/services/redis')
// Middlewares
const { objectIdValidation } = require('myp-admin/http/middlewares')
const { getModelByTenant } = require('myp-admin/database/mongo')
const asyncLoop = require('myp-admin/utils/async-loop')
const { affiliateCheck } = require('myp-admin/http/middlewares/affiliate.middleware')
const { AWS_S3_URL } = process.env

/**
 * List or detail entity
 */
router.get('/:id?', objectIdValidation, async (req, res) => {
  const { id } = req.params
  const { page = 1, limit = 20 } = req.query
  const ShowCase = getModelByTenant(req.tenant, 'ShowCaseSchema')

  if (id) {
    const showcase = await ShowCase.findById(id)

    if (!showcase) {
      return res.status(404).json({
        error: 'showcase_not_found',
      })
    }

    return res.json({
      showcase,
    })
  }

  // Pagination options
  const paginationOptions = {
    page,
    limit,
  }

  // Make pagination
  const pagination = await ShowCase.paginate({}, paginationOptions)

  return res.json(paginationParser('showcases', pagination))
})

/**
 * Store a new entity
 */
router.put('/', affiliateCheck('SHOWCASE', 'CREATE'), async (req, res) => {
  try {
    const Model = getModelByTenant(req.tenant, 'ShowCaseSchema')
    const Product = getModelByTenant(req.tenant, 'ProductSchema')
    const SearchSchema = getModelByTenant('Watcher', 'SearchSchema')

    let {
      name,
      main,
      smart,
      status,
      products,
      position,
      finalDate,
      smartType,
      initialDate,
      smartFilters = {},
    } = req.body

    if (!position) {
      const showcases = await Model.find({})
      position = showcases.length
    }

    initialDate = initialDate ? moment(new Date(initialDate)).startOf('day').toDate() : initialDate
    finalDate = finalDate ? moment(new Date(finalDate)).endOf('day').toDate() : finalDate

    const promises = []

    if (smart) {
      const { control = false } = smartFilters

      const query = {
        status: true,
      }

      const sort = {}

      if (smartType === 'mostSearched') {
        const mostViewedEans = await SearchSchema.aggregate([
          { $match: { 'store.storeId': new ObjectId(req.store) } },
          { $unwind: { path: '$result' } },
          { $unwind: { path: '$result.stars' } },
          { $group: { _id: '$result.stars.ean', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ])

        query['EAN'] = { $in: mostViewedEans.map(({ _id }) => _id) }
      }

      if (smartType === 'mostSelled') {
        sort['quantity'] = -1
      }

      if (control === false) query['control'] = null

      let products = await Product.find(query, null, { sort }).limit(20)

      products = products.map((product) => ({
        product,
        position: null,
      }))

      if (main) {
        await Model.updateMany({
          main: false,
        })
      }

      const smartTypeToName = {
        mostSelled: 'Campeões de venda',
        mostSearched: 'Mais procurados',
      }

      if (!name) name = smartTypeToName[smartType]

      const showcase = await Model.create({
        name,
        originalId: getOriginalId(),
        initialDate,
        finalDate,
        products,
        position,
        status,
        main,
        smart,
        smartFilters,
      })

      // check if store is a head store
      if (req.flagship_store && Array(req.tenants || []).length > 0) {

        req.tenants.forEach(tenant => {
          const affiliate = tenant
          const action = req.action
          const entity = req.entity
          const mainStore = req.tenant

          promises.push(QueuePlugin.publish('affiliate-store-change', { affiliate, mainStore, data: showcase, action, entity }))
        })

        await Promise.all(promises)
      }

      return res.json({
        showcase,
      })

    } else {
      if (moment(initialDate).isAfter(finalDate)) {
        return res.status(400).json({
          error: 'invalid_date',
        })
      }

      if (main) {
        await Model.updateMany({
          main: false,
        })
      }

      if (!(await Model.findOne({ main: true }))) {
        main = true
      }

      await asyncLoop(products, async (product, index) => {
        const found = await Product.findById(product.product)

        if ((!found.image?.thumb || !found.image?.icon) && found.image?.key) {
          const buffer = await axios
            .get(`${AWS_S3_URL}${found.image.key}`, {
              responseType: 'arraybuffer',
            })
            .then((res) => res.data)
            .catch((err) => console.log(`product ${found.EAN} image not found`))

          if (buffer) {
            const icon = {
              content: await fileHelper(Buffer.from(buffer).toString('base64'), { width: 25, height: 25 }),
              path: `${req.tenant}/product/icon-${found.image.name}.webp`,
            }

            const thumb = {
              content: await fileHelper(Buffer.from(buffer).toString('base64'), { width: 200, height: 200 }),
              path: `${req.tenant}/product/thumb-${found.image.name}.webp`,
            }

            const iconUpload = await put(icon.path, icon)
            const thumbUpload = await put(thumb.path, thumb)

            await Product.updateOne(
              {
                _id: found._id,
              },
              { image: { ...found.image, thumb: thumbUpload.Key, icon: iconUpload.Key } }
            )

            found.image = { ...found.image, thumb: thumbUpload.Key, icon: iconUpload.Key }

            await Model.updateMany(
              { 'products.product._id': found._id },
              { $set: { 'products.$[element].product': found } },
              {
                arrayFilters: [{ 'element.product._id': found._id }],
                multi: true,
              }
            )

            await QueuePlugin.publish('mongo-invalidate-product', [
              {
                tenant: req.tenant,
                ean: found.EAN,
              },
            ])
          } else {
            console.log(`deleting product ${found.EAN} image`)
            await Product.updateOne(
              {
                _id: found._id,
              },
              { image: null }
            )
          }
        }

        products[index] = {
          product: found,
          position: product.position,
        }
      })

      const obj = await Model.create({
        name,
        originalId: getOriginalId(),
        initialDate,
        finalDate,
        products,
        position,
        status,
        main,
        smart,
      })

      await RedisService.remove(`showcase:${req.store}`)

      // check if store is a head store
      if (req.flagship_store && Array(req.tenants || []).length > 0) {

        req.tenants.forEach(tenant => {
          const affiliate = tenant
          const action = req.action
          const entity = req.entity
          const mainStore = req.tenant

          promises.push(QueuePlugin.publish('affiliate-store-change', { affiliate, mainStore, data: obj, action, entity }))
        })
        await Promise.all(promises)
      }

      return res.json({
        showcase: obj,
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: error.message,
    })
  }
})

router.put('/smart', async (req, res) => {
  const { quantity = 1, control = false, initialDate, finalDate, name, position } = req.query
  const SearchSchema = getModelByTenant('Dev_Watcher', 'SearchSchema')
  const ProductSchema = getModelByTenant(req.tenant, 'ProductSchema')
  const ShowcaseSchema = getModelByTenant(req.tenant, 'ShowcaseSchema')

  await ShowcaseSchema.save({ products })

  await RedisService.remove(`showcase:${req.store}`)

  res.json({ products })
})

router.post('/', async (req, res) => {
  const Showcase = getModelByTenant(req.tenant, 'ShowCaseSchema')
  const Product = getModelByTenant(req.tenant, 'ProductSchema')

  const { showcases } = req.body

  await Promise.allSettled(
    showcases.map(
      async ({ _id, ...value }) =>
        await Showcase.updateOne(
          {
            _id,
          },
          {
            ...value,
            updatedAt: new Date(),
          }
        )
    )
  )

  const data = await Showcase.find()
  await RedisService.remove(`showcase:${req.store}`)
  return res.status(200).json({ showcases: data })
})

/**
 * Update an existing entity
 */
router.post('/:id', affiliateCheck('SHOWCASE', 'UPDATE'), objectIdValidation, async (req, res) => {
  try {
    const { id } = req.params
    let {
      name,
      main = false,
      status = true,
      smart = false,
      products = [],
      position = null,
      finalDate = null,
      initialDate = null,
      smartFilters = undefined
    } = req.body

    const Product = getModelByTenant(req.tenant, 'ProductSchema')
    const SearchSchema = getModelByTenant('Watcher', 'SearchSchema')
    const ShowCaseSchema = getModelByTenant(req.tenant, 'ShowCaseSchema')

    const promises = []

    let showcase = await ShowCaseSchema.findById(id)

    if (!showcase) {
      return res.status(404).json({
        error: 'showcase_not_found',
      })
    }

    if (position) {
      const checkPosition = await ShowCaseSchema.exists({ position, _id: { $ne: new ObjectId(id) } })

      if (checkPosition) {
        return res.json({
          Error: `showcase_position_taken`,
        })
      }
    }

    initialDate = initialDate ? moment(new Date(initialDate)).startOf('day').toDate() : initialDate
    finalDate = finalDate ? moment(new Date(finalDate)).endOf('day').toDate() : finalDate

    if (smart) {
      const { control = false, quantity = 1 } = smartFilters

      const mostViewedEans = await SearchSchema.aggregate([
        { $match: { 'store.storeId': new ObjectId(req.store) } },
        { $unwind: { path: '$result' } },
        { $unwind: { path: '$result.stars' } },
        { $group: { _id: '$result.stars.ean', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])

      const query = {
        EAN: { $in: mostViewedEans.map(({ _id }) => _id) },
        quantity: { $gte: quantity },
        status: true,
      }

      if (control === false) {
        query['control'] = null
      }

      products = await Product.find(query).limit(20)

      products = products.map((product) => ({
        product,
        position: null,
      }))
    }

    if (products.length > 0) {
      const showCaseProductUpdated = []
      const ids = products.map(item => new ObjectId(item.product._id))

      const showCaseProducts = await Product.find({
        _id: { $in: ids }
      })

      products.forEach(_product => {
        const product = showCaseProducts.find((p => p._id.toString() === _product.product._id.toString()) || (p.EAN.toString() === _product.product.EAN.toString()))

        if (product) {
          showCaseProductUpdated.push({
            ..._product,
            product
          })
        }
      })

      products = []
      products.push(...showCaseProductUpdated)
    }

    const updateFields = updateFieldsParser({
      name,
      main,
      smart,
      status,
      position,
      products: req.body.products ? products : undefined,
      finalDate,
      initialDate,
      smartFilters,
    })

    if (main) {
      await ShowCaseSchema.updateMany({
        main: false,
      })
    }

    // Update data
    await showcase.updateOne({
      ...updateFields,
      updatedAt: Date.now(),
    })

    // Get updated data
    showcase = await ShowCaseSchema.findById(id)
    await RedisService.remove(`showcase:${req.store}`)

    // check if store is a head store
    if (req.flagship_store && Array(req.tenants || []).length > 0) {

      req.tenants.forEach(tenant => {
        const affiliate = tenant
        const action = req.action
        const entity = req.entity
        const mainStore = req.tenant

        promises.push(QueuePlugin.publish('affiliate-store-change', { affiliate, mainStore, data: showcase, action, entity }))
      })

      await Promise.all(promises)
    }

    return res.json({
      showcase
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
})

router.post('/push/products', async (req, res) => {
  try {
    const Showcase = getModelByTenant(req.tenant, 'ShowCaseSchema')
    const Product = getModelByTenant(req.tenant, 'ProductSchema')
    let { products } = req.body

    let showcase = await Showcase.findOne({ main: true })

    if (!showcase) {
      res.status(404).json({ error: 'showcase_not_found' })
    }

    products = await Product.find({ _id: { $in: products } })

    products.map((product) => {
      showcase.products.push({
        position: null,
        product,
      })
    })

    showcase = await showcase.save()

    await RedisService.remove(`showcase:${req.store}`)

    return res.json({ showcase })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error })
  }
})

/**
 * Delete an existing entity
 */
router.delete('/:id', affiliateCheck('SHOWCASE', 'DELETE'), objectIdValidation, async (req, res) => {
  const Model = getModelByTenant(req.tenant, 'ShowCaseSchema')
  const { id } = req.params
  const promises = []

  const obj = await Model.findById(id)

  if (!obj) {
    return res.status(404).json({
      error: 'showcase_not_found',
    })
  }

  // check if store is a head store
  if (req.flagship_store && Array(req.tenants || []).length > 0) {

    req.tenants.forEach(tenant => {
      const affiliate = tenant
      const action = req.action
      const entity = req.entity
      const mainStore = req.tenant

      promises.push(QueuePlugin.publish('affiliate-store-change', { affiliate, mainStore, data: obj, action, entity }))
    })

    await Promise.all(promises)
  }

  // Make deletion
  await obj.delete()
  await RedisService.remove(`showcase:${req.store}`)


  return res.json({
    deletedId: id,
  })
})

module.exports = router
