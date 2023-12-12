const router = require('express').Router()
// Mongo ORM
const {
  ORM,
  ObjectID,
  OrderRepository,
  IntegrationUserErpRepository,
  StoreRepository,
} = require('@mypharma/api-core')
// Token to Store
const { v4 } = require('uuid')
// Decode store_token Mongo
const decodeMongo = require('../../middlewares/decodeTokenMongo.middleware')
// Moment
const moment = require('moment')
// Parser Order
const { parserOrders } = require('../../utils/normalize-mongo-orders')
// Auth Mongo
const auth = require('../../middlewares/auth.mongo.middleware')

const getDateRange = require('../../utils/getDateRange')

router.use(auth)

router.post('/products', decodeMongo, async (req, res) => {

  try {
    await ORM.setup(null, req.tenant)
    const { page = 1, pageSize = 50, updatedAt = null, createdAt = null, orderStatus = null } = req.query

    const status = ['accepted', 'out_delivery', 'delivery_made']

    let where = {
      "statusOrder.type": { $in: status, $ne: 'integrated_in_erp' }
    }

    if (orderStatus) {
      where['statusOrder.type'] = orderStatus
    }

    if (createdAt) {
      const { startDay, endDay } = getDateRange(createdAt)

      where = {
        ...where,
        createdAt: {
          $gte: startDay,
          $lt: endDay
        }
      }
    }

    if (updatedAt) {
      const { startDay, endDay } = getDateRange(updatedAt)

      where = {
        ...where,
        updatedAt: {
          $gte: startDay,
          $lt: endDay
        }
      }
    }

    const [orders, total] = await OrderRepository.repo(req.tenant).findAndCount({
      where,
      order: { createdAt: -1 },
      take: Number(pageSize),
      skip: (page - 1) * pageSize
    })

    const totalPages = Math.ceil(total / Number(pageSize))
    const store = await StoreRepository.repo().findById(req.store_id)
    const ordersParser = parserOrders(orders, store)

    return res.json({
      orders: ordersParser,
      items: orders.length,
      pages: totalPages
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
})


router.post('/orders', decodeMongo, async (req, res) => {
  try {
    await ORM.setup(null, req.tenant)
    const { page = 1, pageSize = 50, updatedAt = null, createdAt = null, orderStatus = null } = req.query

    const status = ['accepted', 'out_delivery', 'delivery_made']

    let where = {
      "statusOrder.type": { $in: status, $ne: 'integrated_in_erp' }
    }

    if (orderStatus) {
      where['statusOrder.type'] = orderStatus
    }

    if (createdAt) {
      const startDay = moment(createdAt).utc().startOf('day').toDate()
      const endDay = moment().utc().endOf('day').toDate()

      where = {
        ...where,
        createdAt: {
          $gte: startDay,
          $lte: endDay
        }
      }
    }

    if (updatedAt) {
      const startDay = moment(updatedAt).utc().startOf('day').toDate()
      const endDay = moment().utc().endOf('day').toDate()

      where = {
        ...where,
        updatedAt: {
          $gte: startDay,
          $lte: endDay
        }
      }
    }

    const [orders, total] = await OrderRepository.repo(req.tenant).findAndCount({
      where,
      order: { createdAt: -1 },
      take: Number(pageSize),
      skip: (page - 1) * pageSize
    })

    const totalPages = Math.ceil(total / Number(pageSize))
    const store = await StoreRepository.repo().findById(req.store_id)

    return res.json({
      orders: parserOrders(orders, store),
      items: orders.length,
      pages: totalPages
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
})

router.put('/setUserToStore', async (req, res) => {
  try {
    const { store_id, user_id } = req.body

    const user = await IntegrationUserErpRepository.repo().findById(user_id)

    if (!user) {
      return res.status(404).json({
        error: 'user_not_found'
      })
    }

    const { store } = user

    if (store.filter(s => s._id.toString() === store_id.toString()).length > 0) {
      return res.status(401).json({
        error: 'user_have_integration_with_store'
      })
    }

    const storeExists = await StoreRepository.repo().findById(store_id)

    if (!storeExists) {
      return res.status(404).json({
        error: 'store_not_found'
      })
    }

    const token = v4()

    await IntegrationUserErpRepository.repo().findOneAndUpdate(
      { _id: new ObjectID(user_id) },
      { $push: { store: { ...storeExists, token } } }
    )

    return res.json({
      token
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
})

router.get('/list-integrations', async (req, res) => {
  try {
    const users = await IntegrationUserErpRepository.repo().find({})

    return res.json({
      users
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
})

router.get('/list-stores', async (req, res) => {
  try {
    const stores = await StoreRepository.repo().find({})

    return res.json({
      stores
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }

})

router.get('/list-users', async (req, res) => {
  try {

    const users = await IntegrationUserErpRepository.repo().find({
      where: {
        admin: false
      }
    })

    return res.json({
      users
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
})

module.exports = router
