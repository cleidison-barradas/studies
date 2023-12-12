const router = require('express').Router()
const decodeMongo = require('../../middlewares/decodeTokenMongo.middleware')
const auth = require('../../middlewares/auth.mongo.middleware')
const {
  ORM,
  logger,
  colors,
  OrderRepository,
  StatusOrderRepository,
  HistoryOrderRepository
} = require('@mypharma/api-core')
const moment = require('moment')
const { ObjectId } = require('bson')
const { QueuePlugin } = require('../../plugins/queue')

const RedisPlugin = require('../../services/redis')
const validProducts = require('../../utils/validProducts')
const removeDuplicates = require('../../utils/removeDuplicates')
const parserProducts = require('../../utils/parserProducts')

router.use(auth)

const MAX_PRODUCT_LIMIT = 5000;
const REDIS_EXPIRATION_TIME = 1;

router.put('/order', decodeMongo, async (req, res) => {
  try {
    await ORM.setup(null, req.tenant)
    const { order_id, orderStatus } = req.body

    if (!order_id || !orderStatus) {
      return res.status(400).json({
        error: 'missing_fields',
        fields: ['order_id', 'orderStatus']
      })
    }

    const statusOrder = await StatusOrderRepository.repo().findOne({ type: orderStatus })

    if (orderStatus) {
      switch (orderStatus) {
        case "accepted":
          await updateOrder(statusOrder)
          break

        case "delivery_made":
          await updateOrder(statusOrder)
          break

        case "out_delivery":
          await updateOrder(statusOrder)
          break

        case "integrated_in_erp":
          await updateOrder(statusOrder)
          break

        case "erp_integration_error":
          await updateOrder(statusOrder)
          break

        default:
          return res.status(400).json({
            error: "order_status_is_not_accepted.",
            accepted_values: "[accepted, delivery_made, out_delivery, integrated_in_erp, erp_integration_error]"
          })
      }

      async function updateOrder(statusOrder = null) {

        if (statusOrder) {
          await OrderRepository.repo(req.tenant).updateOne(
            {
              _id: ObjectId(order_id)
            },
            {
              $set: { statusOrder }
            }
          )
          await createHistoryOrder()
        }
      }
      async function createHistoryOrder() {
        const _id = new ObjectId(order_id)

        const order = await OrderRepository.repo(req.tenant).findById(_id)

        if (!order) {
          return res.status(404).json({
            error: 'order_not_found'
          })
        }

        await HistoryOrderRepository.repo(req.tenant).createDoc({
          notify: false,
          deleted: false,
          order: order,
          status: order.statusOrder,
          comments: "alterado_pelo_erp",
          updatedAt: new Date(),
          createdAt: new Date()
        })
        await okayResponse();
      }
      async function okayResponse() {
        res.status(200).json({ message: "ok", status: 200 })
      }
    } else {
      res.status(400).json({
        error: "Order status is not defined"
      })
    }
  } catch (error) {
    console.log(error)
  }
})


router.put('/products', decodeMongo, async (req, res) => {
  try {
    const { products = [] } = req.body
    const tenant = req.tenant
    const userId = req.user._id.toString()

    if (!products || products.length === 0) {
      return res.status(400).json({
        error: 'invalid_array_products'
      })
    }
    const sent = products.length

    if (sent > MAX_PRODUCT_LIMIT) {
      return res.status(400).json({
        error: 'product_limit_exceeded',
        max: MAX_PRODUCT_LIMIT,
        description: 'Maximo de requisição de produtos é de 5 em 5 mil'
      })
    }

    const parsed = parserProducts(products)

    const valids = validProducts(parsed)

    const filtred = removeDuplicates(valids)

    let redisConnection = await RedisPlugin.get(req.redisKey) || null

    if (!redisConnection) {

      redisConnection = {
        ...redisConnection,
        tenant,
        userId,
        products: filtred
      }
    } else {

      redisConnection['products'] = filtred
      await RedisPlugin.delete(req.redisKey)
    }

    await RedisPlugin.set(req.redisKey, redisConnection)

    const expiresAt = moment().add(REDIS_EXPIRATION_TIME, 'hours').unix()
    await RedisPlugin.expireAt(req.redisKey, expiresAt)

    await QueuePlugin.publish("erp-update", { redisKey: req.redisKey })

    logger(`Sending products ${filtred.length}`, colors.BgGreen)

    return res.json({
      message: `received ${filtred.length} to process`
    })

  } catch (error) {
    console.error(error)
    await RedisPlugin.delete(req.redisKey)

    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
})

module.exports = router