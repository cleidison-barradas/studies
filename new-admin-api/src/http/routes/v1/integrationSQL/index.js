// Router
const router = require('express').Router()

// Database
const { Mongo: { Models: {
  IntegrationSQLSchema, StoreIntegrationSchema
} } } = require('myp-admin/database')

// Helpers
const { paginationParser } = require('myp-admin/helpers')
const updateFieldsParser = require('../../../../helpers/update-fields.parser')

// Middlewares
const { objectIdValidation } = require('myp-admin/http/middlewares')
const { ERPSchema } = require('myp-admin/database/mongo/models')

router.get('/:id?', objectIdValidation, async (req, res) => {
  const { id } = req.params
  const { page = 1, limit = 20, name = '' } = req.query

  try {
    const Model = IntegrationSQLSchema.Model()

    // Detail OpeningHour
    if (id) {
      const obj = await Model.findById(id)

      if (!obj) {
        return res.status(404).json({
          error: 'integrationSQL_not_found'
        })
      }

      return res.json({
        integration: obj
      })
    } else {

      // Pagination options
      const paginationOptions = {
        page,
        limit,
      }

      const { erp } = await StoreIntegrationSchema.Model().findOne({ store: req.store }).select('erp')

      const filters = {
        name: new RegExp(name, 'ig'),
        erp
      }

      // Make pagination
      const pagination = await Model.paginate(filters, paginationOptions)

      return res.json(
        paginationParser('integrations', pagination)
      )

    }
  } catch (error) {
    return res.status(400).json({
      error: error.message
    })
  }
})

/**
 * Store a new entity
 */
router.put('/', async (req, res) => {

  let { name, sql, erp, description } = req.body

  try {
    const Model = IntegrationSQLSchema.Model()
    const ERP = ERPSchema.Model()

    erp = await ERP.findById(erp)

    const obj = await Model.create({
      name,
      sql,
      erp,
      description
    })

    return res.json({
      integrations: obj
    })

  } catch (error) {
    return res.status(400).json({
      error: error.message
    })
  }

})

/**
 * Update an existing entity
 */
router.post('/:id', objectIdValidation, async (req, res) => {
  const { id } = req.params
  let { name, sql, erp, description } = req.body

  try {

    const Model = IntegrationSQLSchema.Model()
    const ERP = ERPSchema.Model()

    
    let obj = await Model.findById(id)

    if (!obj) {
      return res.status(404).json({
        error: 'integrationSQL_not_found'
      })
    }

    if(erp){
      erp = await ERP.findById(erp)
    }

    const updateFields = updateFieldsParser({
      name,
      sql,
      erp,
      description
    })

    // Update data
    await obj.updateOne({
      ...updateFields,
      updatedAt: Date.now()
    })

    // Get updated data
    obj = await Model.findById(id)

    return res.json({
      integrations: obj
    })

  } catch (error) {
    return res.status(400).json({
      error: error.message
    })
  }


})

/**
 * Delete an existing entity
 */
router.delete('/:id', objectIdValidation, async (req, res) => {
  const { id } = req.params

  try {
    const Model = IntegrationSQLSchema.Model()

    const obj = await Model.findById(id)

    if (!obj) {
      return res.status(404).json({
        error: 'integration_not_found'
      })
    }

    // Make deletion
    await obj.delete()

    return res.json({
      deletedId: id
    })


  } catch (error) {
    return res.status(400).json({
      error: error.message
    })
  }
})

module.exports = router
