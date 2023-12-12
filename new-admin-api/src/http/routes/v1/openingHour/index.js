// Router
const router = require('express').Router()

// Middlewares
const { objectIdValidation } = require('myp-admin/http/middlewares')

const { paginationParser, updateFieldsParser } = require('../../../../helpers');

const { Mongo: { getModelByTenant } } = require('myp-admin/database')

router.use((req, res, next) => {
  req.models = {
    openingHour: getModelByTenant(req.tenant, 'OpeningHourSchema'),
  }
  next()
})

/**
 * List or detail entity
 */
router.get('/:id?', objectIdValidation, async (req, res) => {
  const { id } = req.params
  const { page = 1, limit = 20 } = req.query
  const Model = req.models.openingHour

  // Detail OpeningHour
  if (id) {
    const obj = await Model.findById(id)

    if (!obj) {
      return res.status(404).json({
        error: 'OpeningHour_not_found'
      })
    }

    return res.json({
      obj
    })
  } else {

    // Pagination options
    const paginationOptions = {
      page,
      limit
    }

    // Make pagination
    const pagination = await Model.paginate({}, paginationOptions)

    return res.json(
      paginationParser('openingHours', pagination)
    )

  }
})

/**
 * Store a new entity
 */
router.put('/', async (req, res) => {

  const { openingTime, closingTime, weekDay } = req.body

  const Model = req.models.openingHour

  /*if(Model.find({openingTime : openingTime,weekDay : weekDay,closingTime : closingTime})){
    return res.json({
      Error : 'Opening time already exists'
    })
  }*/

  const check = await Model.find({ openingTime: openingTime, weekDay: weekDay, closingTime: closingTime }).then(res => res.length)


  if (check) {
    return res.json({
      Error: 'Opening time already exists'
    })
  }

  const obj = await Model.create({
    openingTime,
    closingTime,
    weekDay
  })

  res.json({
    openingHour: obj
  })

})

/**
 * Update an existing entity
 */
router.post('/:id', objectIdValidation, async (req, res) => {
  const { id } = req.params
  const { openingTime, closingTime, weekDay } = req.body

  const Model = req.models.openingHour

  let obj = await Model.findById(id)

  if (!obj) {
    return res.status(404).json({
      error: 'OpeningHour_not_found'
    })
  }


  const updateFields = updateFieldsParser({
    openingTime,
    closingTime,
    weekDay
  })

  // Update data
  await obj.updateOne({
    ...updateFields,
    updatedAt: Date.now()
  })

  // Get updated data
  obj = await Model.findById(id)

  return res.json({
    openingHour: obj
  })


})

/**
 * Delete an existing entity
 */
router.delete('/:id', objectIdValidation, async (req, res) => {
  const { id } = req.params
  const Model = req.models.openingHour

  const obj = await Model.findById(id)

  if (!obj) {
    return res.status(404).json({
      error: 'OpeningHour_not_found'
    })
  }

  // Make deletion
  await obj.delete()

  return res.json({
    deletedId: id
  })

})

module.exports = router
