// Router
const router = require('express').Router()

// Database
const { Mongo: { Models: { ERPSchema } } } = require('myp-admin/database')
const { Mongo } = require('myp-admin/database')
// Helpers
const { paginationParser } = require('myp-admin/helpers')
const updateFieldsParser = require('../../../../helpers/update-fields.parser')

// Middlewares
const { objectIdValidation } = require('myp-admin/http/middlewares')

/**
 * List or detail entity
 */
router.get('/:id?', objectIdValidation, async (req, res) => {
  const { id } = req.params
  const { page = 1, limit = 20 } = req.query

  try {
    const Model = ERPSchema.Model()

    if (id) {
      const erp = await Model.findById(id)

      if (!erp) {
        return res.status(404).json({
          error: 'erp_not_found'
        })
      }

      return res.json({ erp })
    }

    const paginationOptions = {
      page,
      limit
    }

    const pagination = await Model.paginate({}, paginationOptions)

    return res.json(paginationParser('erps', pagination))
  } catch (err) {
    return res.status(400).json({ error: error.message })
  }

})

router.put('/', async (req, res) => {
  const { name, dialect } = req.body

  try {
    const Erp = ERPSchema.Model()

    const erp = new Erp({ name, dialect })
    const saved = await erp.save()

    return res.json({
      erp: saved
    })
  } catch (err) {
    return res.status(400).json({
      error: err.message
    })
  }

})

router.post('/:id', async (req, res) => {

  const { id } = req.params
  const { name, dialect } = req.body

  try {
    const Model = ERPSchema.Model()

    let erp = await Model.findById(id)

    if (!erp) {
      return res.status(404).json({
        error: 'erp_not_found'
      })
    }

    const updateFields = updateFieldsParser({
      name,
      dialect
    });

    await erp.updateOne(updateFields)

    const updated = await Model.findById(id)

    return res.json({
      erp: updated
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
    await Mongo.init()
    const Model = ERPSchema.Model()

    const obj = await Model.findById(id)

    if (!obj) {
      return res.status(404).json({
        error: 'erp_not_found'
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
