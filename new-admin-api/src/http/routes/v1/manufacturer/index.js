// Router
const router = require('express').Router()
// Database
const { Mongo: { getModelByTenant } } = require('myp-admin/database')
// Helpers
const { paginationParser } = require('myp-admin/helpers')
const updateFieldsParser = require('myp-admin/helpers/update-fields.parser')
//s3
const { remove } = require('../../../../services/aws')
const { objectIdValidation } = require('../../../middlewares')

/**
 * List or detail entity
 */
router.get('/:id?', objectIdValidation, async (req, res) => {
  const { id } = req.params
  const { page = 1, limit = 20, name = '' } = req.query
  const Manufacturer = getModelByTenant(req.tenant, 'ManufacturerSchema')

  if (id) {
    const manufacturer = await Manufacturer.findById(id)

    if (!manufacturer) {
      return res.status(404).json({
        error: 'manufacturer_not_found'
      })
    }

    return res.json({
      manufacturer
    })
  }

  const paginationOptions = {
    page,
    limit,
  };

  const filters = {
    name: new RegExp(name, 'gi')
  }

  const manufacturers = await Manufacturer.paginate(filters, paginationOptions);

  return res.json(paginationParser('manufacturers', manufacturers))
})

/**
 * Store a new entity
 */
router.put('/', async (req, res) => {

  const { originalId, name } = req.body

  const Manufacturer = getModelByTenant(req.tenant, 'ManufacturerSchema')

  const manufacturer = await Manufacturer.create({
    originalId,
    name
  })

  res.json({
    manufacturer
  })

})

/**
 * Update an existing entity
 */
router.post('/:id', objectIdValidation, async (req, res) => {
  const { id } = req.params
  const { originalId, name } = req.body

  const Manufacturer = getModelByTenant(req.tenant, 'ManufacturerSchema')
  const Product = getModelByTenant(req.tenant, 'ProductSchema')

  let manufacturer = await Manufacturer.findById(id)

  if (!manufacturer) {
    return res.status(404).json({
      error: 'manufacturer_not_found'
    })
  }

  if (manufacturer.image) {
    await remove(manufacturer.image)
  }

  // Mount update fields object
  const updateFields = updateFieldsParser({
    originalId,
    name
  })

  // Update data
  await manufacturer.updateOne({
    ...updateFields,
    updatedAt: Date.now()
  })

  // Get updated data
  manufacturer = await Manufacturer.findById(id)
  await Product.updateMany({
    'manufacturer._id': manufacturer._id
  }, {
    manufacturer
  })

  return res.json({
    manufacturer
  })

})

/**
 * Delete an existing entity
 */
router.delete('/:id', objectIdValidation, async (req, res) => {
  const { id } = req.params
  const Manufacturer = getModelByTenant(req.tenant, 'ManufacturerSchema')
  const Product = getModelByTenant(req.tenant, 'ProductSchema')

  const manufacturer = await Manufacturer.findById(id)

  if (!manufacturer) {
    return res.status(404).json({
      error: 'Manufacturer_not_found'
    })
  }

  // Make deletion
  await manufacturer.delete()

  if (manufacturer.image) {
    await remove(manufacturer.image)
  }

  await Product.updateMany({
    'manufacturer._id': manufacturer._id
  }, {
    manufacturer: null
  })

  return res.json({
    deletedId: id
  })

})

module.exports = router