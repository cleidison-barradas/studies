const router = require('express').Router()
const AsyncLoop = require('myp-admin/utils/async-loop')
const { objectIdValidation } = require('myp-admin/http/middlewares')
const { updateFieldsParser } = require('myp-admin/helpers')
const {
  Mongo: {
      Models: {StoreSchema},
      getModelByTenant
  }
} = require('myp-admin/database')


router.get('/', objectIdValidation, async (req, res) => {
  try {
    const DistanceDeliveryfee = getModelByTenant(req.tenant, 'DistanceDeliveryFeeSchema')

    const distanceDeliveryFees = await DistanceDeliveryfee.find().sort({'distance': 1})

    if (!distanceDeliveryFees) {
      return res.status(404).json({
        error: 'delivery_charges_not_found',
      })
    }

    return res.json({distanceDeliveryFees})

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
})

router.post('/', objectIdValidation, async (req, res) => {
  try {
    const DistanceDeliveryfee = getModelByTenant(req.tenant, 'DistanceDeliveryFeeSchema')
    const Stores = StoreSchema.Model()
    let store = await Stores.findById(req.store)
    const { deliveryTime = 0, feePrice = 0, freeFrom = 0, minimumPurchase = 0, distance = 0, distanceDeliveries = [] } = req.body

    if (distance > 0 && deliveryTime > 0) {
    const distanceDeliveryFees = await DistanceDeliveryfee.findOne({'distance': distance})
    if (!distanceDeliveryFees){
      await DistanceDeliveryfee.create({
            feePrice,
            freeFrom,
            deliveryTime: Number(deliveryTime),
            distance,
            minimumPurchase,
          })
      }
    }
    if(distanceDeliveries.length > 0){
      await AsyncLoop(distanceDeliveries, async delivery => {
        const { _id, feePrice, deliveryTime, freeFrom, minimumPurchase, distance } = delivery

        if (_id) {
          const distanceDeliveryfeeExists = await DistanceDeliveryfee.findById(_id)

          if (distanceDeliveryfeeExists) {
            const updateFields = updateFieldsParser({
              feePrice,
              freeFrom,
              deliveryTime,
              minimumPurchase,
              distance,
            })

            await distanceDeliveryfeeExists.updateOne({
              ...updateFields,
              updatedAt: Date.now(),
            })
          }
        }
      })
    }

    if (!store) {
      return res.status(404).json({
          error: 'store_not_found',
        })
      }

    await store.updateOne({
        'settings.config_local_delivery_rule': 'distance',
        updatedAt: Date.now(),
    })

    return res.json({ ok: true })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
})

router.post('/delete', async (req, res) => {
  try {
    const DistanceDeliveryfee = getModelByTenant(req.tenant, 'DistanceDeliveryFeeSchema')

    const { deliveries = [] } = req.body;
    let deletedId = []
    if (deliveries.length > 0) {
      await AsyncLoop(deliveries, async id => {

        const delivery = await DistanceDeliveryfee.findById(id);

        if (delivery) {
          deletedId.push(delivery)
          await delivery.delete()
        }
      })

      return res.json({
        deletedId
      })
    }

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
})

module.exports = router