const router = require('express').Router()
const { objectIdValidation } = require('myp-admin/http/middlewares')
const updateFieldsParser = require('../../../../helpers/update-fields.parser')

const {
  Mongo: {
    Models: { StoreIntegrationSchema },
  }
} = require('myp-admin/database')
const { IntegrationSQLSchema } = require('myp-admin/database/mongo/models')

router.get('/', objectIdValidation, async (req, res) => {

  try {
    const store = req.store
    const Model = StoreIntegrationSchema.Model()

    const found = await Model.findOne({ store })

    if (!found) {
      return res.status(400).json({
        error: 'storeIntegration_not_found'
      })
    }

    return res.json({
      storeIntegration: found
    })

  } catch (error) {
    return res.status(400).json({
      error: error.message
    })
  }

})

router.post('/', async (req, res) => {
  try {
    const store = req.store
    let { fields, onlyFractioned, integration } = req.body
    const Model = StoreIntegrationSchema.Model()
    const Integration = IntegrationSQLSchema.Model()

    const obj = await Model.findOne({ store })

    if (!obj) {
      return res.status(404).json({
        error: 'storeIntegration_not_found'
      })
    }

    if(integration){
      integration = await Integration.findById(integration)
    }

    const updateFields = updateFieldsParser({
      fields,
      onlyFractioned,
      integration,
    });

    await obj.updateOne({
      ...updateFields,
      updatedAt: Date.now()
    })

    const updated = await Model.find({ store })
    
    return res.json({
      storeIntegration: updated
    })
  } catch (error) {
    return res.status(400).json({
      error: error.message
    })
  }
})

module.exports = router;