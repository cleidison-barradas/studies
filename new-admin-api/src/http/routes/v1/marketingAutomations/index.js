const { ObjectId } = require('bson');
const parserAutomations = require('myp-admin/helpers/parserAutomations');
const { Models: { RemarketingSchema, NotificationCustomerSchema }, getModelByTenant } = require('../../../../database/mongo')
const moment = require('moment')

const router = require('express').Router()

router.get('/statistics', async (req, res) => {
  try {
    const Remarketing = RemarketingSchema.Model()
    const date_start = moment().startOf('day').toDate()
    const date_end = moment().endOf('day').toDate()

    const statistics = await Remarketing.countDocuments({
      'store.storeId': new ObjectId(req.store),
      createdAt: {
        $gte: date_start,
        $lte: date_end
      }
    })

    return res.send({ statistics })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
})

router.get('/automations', async (req, res) => {

  try {
    const Automations = getModelByTenant(req.tenant, 'MarketingAutomationSchema')
    const automations = await Automations.find().limit(1)

    if (automations.length === 0) {
      return res.json({
        automations: {}
      })
    }
    const response = parserAutomations(automations.pop())

    return res.json({
      automations: response
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
});

router.put('/automations', async (req, res) => {
  try {
    const Automations = getModelByTenant(req.tenant, 'MarketingAutomationSchema')
    const { automations } = req.body
    let _id = automations._id || null

    let data = {
      MISS_YOU: []
    }

    Object.keys(automations).forEach(key => {
      const [pos1, pos2, interval] = key.split('_')

      if (!isNaN(interval)) {

        data.MISS_YOU.push({
          interval: Number(interval),
          active: automations[key]
        })

      } else {

        data = {
          ...data,
          [key]: automations[key]
        }
      }

    })

    if (_id) {
      await Automations.updateOne(
        { _id },
        { $set: { ...data } }
      )

    } else {
      const newAutomation = await Automations.create(data)
      _id = new ObjectId(newAutomation._id)
    }

    const automation = await Automations.findById(_id)

    const response = parserAutomations(automation)

    return res.json({
      automations: response
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
})

router.put('/mail/customers', async (req, res) => {
  try {
    const Automations = getModelByTenant(req.tenant, 'MarketingAutomationSchema')
    const Notification = NotificationCustomerSchema.Model()
    const { automations, process = 'pending' } = req.body
    let _id = automations._id || null
    let automation = null


    if (!_id) {
      automation = await Automations.create(automations)

    } else {
      automation = await Automations.findById(_id)

      await automation.updateOne({
        message: automations.message,
        subject: automations.subject
      })
    }

    automation = await Automations.findById(automation._id)

    const notify = await Notification.findOne({ storeId: req.store })

    if (!notify) {

      await Notification.create({
        process,
        storeId: req.store,
        target: 'customers',
        message: automations.message,
        subject: automations.subject,
      })
    } else {

      if (notify.process === 'sent') {

        await Notification.updateOne(
          { storeId: req.store },
          {
            $set: {
              process,
              storeId: req.store,
              target: 'customers',
              message: automations.message,
              subject: automations.subject,
            }
          }
        )
      }
    }

    return res.json({
      automations: parserAutomations(automation)
    })


  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
})

module.exports = router