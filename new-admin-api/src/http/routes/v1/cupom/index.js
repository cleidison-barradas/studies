// Router
const router = require('express').Router()
const { celebrate, Joi, Segments } = require('celebrate')
const moment = require('moment')
// Helpers
const { paginationParser } = require('myp-admin/helpers')
const updateFieldsParser = require('../../../../helpers/update-fields.parser')
const MailingController = require('../../../../services/MailingController')
// Middlewares
const { objectIdValidation } = require('myp-admin/http/middlewares')
const {
  sendgrid: { templates },
} = require('myp-admin/config')
const {
  Mongo: { getModelByTenant },
} = require('myp-admin/database')
const { StoreSchema } = require('myp-admin/database/mongo/models')
const { affiliateCheck } = require('myp-admin/http/middlewares/affiliate.middleware')
const { QueuePlugin } = require('@mypharma/api-core')

/**
 * List or detail entity
 */
router.get('/:id?', objectIdValidation, async (req, res) => {
  const { id } = req.params
  const { page = 1, limit = 20 } = req.query

  const Model = getModelByTenant(req.tenant, 'CupomSchema')

  if (id) {
    const obj = await Model.findById(id)

    if (!obj) {
      return res.status(404).json({
        error: 'cupom_not_found',
      })
    }

    return res.json({
      cupom: obj,
    })
  } else {
    // Pagination options
    const paginationOptions = {
      page,
      limit,
    }

    // Make pagination
    const pagination = await Model.paginate({}, paginationOptions)

    return res.json(paginationParser('cupoms', pagination))
  }
})

/**
 * Store a new entity
 */

router.put(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      cupom: Joi.object().keys({
        name: Joi.string().required(true),
        code: Joi.string().required(true),
        initialDate: Joi.date().default(new Date()),
        finalDate: Joi.date().default(null),
        amount: Joi.number().default(0),
        descountPercentage: Joi.number().default(0.0),
        type: Joi.string().required(),
        descountOnProduct: Joi.number().default(0.0),
        descountOnDelivery: Joi.number().default(0.0),
        descountCategorys: Joi.array().default([]),
        timesUsed: Joi.number(),
        status: Joi.boolean().default(true),
        minimumPrice: Joi.number(),
        products: Joi.array().default([]),
        allProducts: Joi.boolean(),
        notify: Joi.boolean().default(false),
        productBlacklist: Joi.array().default([]),
      }),
      notify: Joi.boolean().default(true),
    }),
  }), affiliateCheck('CUPOM', 'CREATE'),
  async (req, res) => {
    const Model = getModelByTenant(req.tenant, 'CupomSchema')
    const Category = getModelByTenant(req.tenant, 'CategorySchema')
    const Product = getModelByTenant(req.tenant, 'ProductSchema')
    const Store = StoreSchema.Model()


    try {
      const { cupom, notify } = req.body

      let {
        name,
        code,
        initialDate,
        finalDate,
        amount,
        descountPercentage,
        type,
        descountOnProduct,
        descountOnDelivery,
        descountCategorys = [],
        timesUsed,
        status,
        minimumPrice,
        products = [],
        allProducts,
        productBlacklist,
      } = cupom

      if (!initialDate || !finalDate) {
        return res.status(400).json({
          error: 'invalid_date',
        })
      }


      const date_start = moment.utc(initialDate).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      const date_end = finalDate ? moment.utc(finalDate).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') : null

      if (moment.utc(date_start).isAfter(moment.utc(date_end))) {
        return res.status(400).json({
          error: 'invalid_date',
        })
      }

      if (products.length > 0) {
        products = products.map((p) => p.EAN)

        products = await Product.find({ EAN: { $in: products } })
      }

      if (productBlacklist.length > 0) {
        productBlacklist = productBlacklist.map((value) => value.EAN)
      }

      if (descountCategorys.length > 0) {
        descountCategorys = descountCategorys.map((c) => c._id)

        descountCategorys = await Category.find({
          _id: { $in: descountCategorys },
        })
      }

      const obj = await Model.create({
        name,
        code,
        initialDate: date_start,
        finalDate: date_end,
        amount,
        descountPercentage,
        status,
        type,
        descountOnProduct,
        descountOnDelivery,
        descountCategorys: descountCategorys.map((c) => c._id),
        timesUsed,
        minimumPrice,
        products: products.map((p) => p._id),
        allProducts,
        productBlacklist,
      })

      if (notify) {
        const mailingController = new MailingController(req.tenant)
        const customers = await mailingController.findSubscribedCustomers()
        const store = await Store.findById(req.store)

        const parseType = {
          CATEGORY: 'categorias',
          PRODUCT: 'produtos',
        }

        let discount =
          type === 'PRODUCT' && allProducts
            ? `${descountPercentage}% de desconto em todos os produtos da loja!`
            : `${descountPercentage}% de desconto ${type === 'CATEGORY'
              ? `nas categorias: ${descountCategorys.map((category) => category.name).join(', ')}.`
              : `em produtos!`
            }`

        const cupomMails = mailingController.cupomMailFactory({
          customers,
          store,
          discount,
          code,
        })

        const mailTemplate = templates.cupom

        await mailingController.notifyCustomers(cupomMails, mailTemplate, store.settings.config_email)
      }

      const promises = []
      // check if store is a head store
      if (req.flagship_store && Array(req.tenants || []).length > 0) {

        req.tenants.forEach(tenant => {

          const affiliate = tenant
          const action = req.action
          const entity = req.entity
          const mainStore = req.tenant

          promises.push(QueuePlugin.publish('affiliate-store-change', { affiliate, mainStore, data: cupom, action, entity }))
        })

        await Promise.all(promises)
      }

      return res.json({
        cupom: obj,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        error: 'internal_server_error',
      })
    }
  }
)

/**
 * Update an existing entity
 */
router.post('/:id', objectIdValidation, affiliateCheck('CUPOM', 'UPDATE'), async (req, res) => {
  const Cupom = getModelByTenant(req.tenant, 'CupomSchema')
  const { id } = req.params
  const { status } = req.body

  const obj = await Cupom.findById(id)

  if (!obj) {
    return res.status(404).json({
      error: 'cupom_not_found',
    })
  }

  // Update data
  await obj.updateOne({
    status,
    updatedAt: Date.now(),
  })

  // Get updated data
  const cupom = await Cupom.findById(id)

  const promises = []
  // check if store is a head store
  if (req.flagship_store && Array(req.tenants || []).length > 0) {

    req.tenants.forEach(tenant => {

      const affiliate = tenant
      const action = req.action
      const entity = req.entity
      const mainStore = req.tenant

      promises.push(QueuePlugin.publish('affiliate-store-change', { affiliate, mainStore, data: cupom, action, entity }))
    })

    await Promise.all(promises)
  }

  return res.json({
    cupom,
    sucess: true
  })
})
/**
 * Delete an existing entity
 */
router.delete('/:id', affiliateCheck('CUPOM', 'DELETE'), objectIdValidation, async (req, res) => {
  const { id } = req.params
  let CupomSchema = getModelByTenant(req.tenant, 'CupomSchema')

  const cupom = await CupomSchema.findById(id)

  if (!cupom) {
    return res.status(404).json({
      error: 'cupom_not_found',
    })
  }

  const promises = []
  // check if store is a head store
  if (req.flagship_store && Array(req.tenants || []).length > 0) {

    req.tenants.forEach(tenant => {

      const affiliate = tenant
      const action = req.action
      const entity = req.entity
      const mainStore = req.tenant

      promises.push(QueuePlugin.publish('affiliate-store-change', { affiliate, mainStore, data: cupom, action, entity }))
    })

    await Promise.all(promises)
  }

  // Make deletion
  await cupom.delete()

  return res.json({
    deletedId: id,
  })
})

module.exports = router
