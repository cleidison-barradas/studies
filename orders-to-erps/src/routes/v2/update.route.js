const router = require('express').Router()

const { ORM,
    logger,
    colors,
    OrderRepository,
    StatusOrderRepository,
    HistoryOrderRepository,
} = require('@mypharma/api-core')
const moment = require('moment')
const { ObjectId } = require('bson')
const { QueuePlugin } = require('../../plugins/queue')

const auth = require('../../middlewares/auth.mongo.middleware')
const decodeMongo = require('../../middlewares/decodeTokenMongo.middleware')
const RedisPlugin = require('../../services/redis')
const validProducts = require('../../utils/validProducts')
const parserProducts = require('../../utils/parserProducts')
const removeDuplicates = require('../../utils/removeDuplicates')

router.use(auth)

const MAX_PRODUCT_LIMIT = 5000

router.use(auth)
router.put('/order', decodeMongo, async (req, res) => {
    try {
        await ORM.setup(null, req.tenant)
        const { order_id, orderStatus } = req.body

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
                const order = await OrderRepository.repo(req.tenant).findById(order_id)

                await HistoryOrderRepository.repo(req.tenant).insert({
                    notify: false,
                    deleted: false,
                    order: order ? order : null,
                    status: order && order.statusOrder ? order.statusOrder : '',
                    comments: "teste2",
                    updatedAt: new Date(),
                    createdAt: new Date(),
                    __v: 0,
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
        const action = 'productToErp'
        const redisKey = `orders_api_products_${tenant}`
        const redisData = {}

        if(!tenant || !userId) throw new Error('Tenant or userId not found')
        
        if (!products || products.length === 0) {
            return res.status(400).json({
                error: 'invalid_array_products'
            })
        }
        const sent = products.length

        if (sent > MAX_PRODUCT_LIMIT) {
            return res.status(400).json({
                error: 'product_limit_exceeded',
                max: `${MAX_PRODUCT_LIMIT} products`,
                description: 'Maximo de requisição de produtos é de 5 em 5 mil'
            })
        }

        const parsed = parserProducts(products)

        const productsValids = validProducts(parsed)

        const newProducts = removeDuplicates(productsValids)

        if (!newProducts || newProducts.length <= 0) throw new Error('Products not found')

        redisData['tenant'] = tenant
        redisData['userId'] = userId
        redisData['products'] = newProducts

        await RedisPlugin.delete(redisKey)
        const inserted = await RedisPlugin.set(redisKey, redisData)

        if (!inserted.includes('OK')) {
            throw new Error('Failed to store products in Redis')
        }

        const expiresAt = moment().add(REDIS_EXPIRATION_TIME, 'hours').unix()

        await QueuePlugin.publish("erp-update", { redisKey, action, tenant })

        await RedisPlugin.expireAt(redisKey, expiresAt)

        logger(`Sending products ${newProducts.length} in import-data-handler`, colors.BgGreen)

        return res.json({
            message: `received ${newProducts.length} to process`
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: 'internal_server_error'
        })
    }
})

module.exports = router