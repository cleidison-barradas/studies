const { ModuleSchema } = require('myp-admin/database/mongo/models')
const { paginationParser } = require('myp-admin/helpers')
const { objectIdValidation } = require('../../../middlewares')
const updateFieldsParser = require('myp-admin/helpers/update-fields.parser')

const router = require('express').Router()

router.get('/:code?', async (req, res) => {
  try {
    const Module = ModuleSchema.Model()
    const { code } = req.params
    const { page = 1, limit = 20 } = req.query

    if (code) {
      const module = await Module.findOne({ code })

      if (!module) {
        return res.status(404).json({
          error: 'module_not_found'
        })
      }

      return res.json({
        module
      })
    }

    const paginationOptions = {
      page,
      limit,
    }

    const modules = await Module.paginate({}, paginationOptions)
  
    return res.json(paginationParser('modules', modules))

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
})

router.put('/', async (req, res) => {
  try {
    const Module = ModuleSchema.Model()
    const { name, code, description, extras, baseUrl, status, type, imageUrl } = req.body

    const exists = await Module.exists({ code })

    if (exists) {
      return res.status(400).json({
        error: 'code_already_exists'
      })
    }

    const module = await Module.create({
      name,
      type,
      code,
      extras,
      status,
      baseUrl,
      imageUrl,
      description
    })

    return res.json({
      module
    })
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: "internal_server_error"
    })
  }
})

router.post('/:id', objectIdValidation, async (req, res) => {
  try {
    const Module = ModuleSchema.Model()
    const { id } = req.params
    const { name, code, description, extras, baseUrl, status, type, imageUrl } = req.body

    if (code) {
      const exists = await Module.exists({ code })
  
      if (exists) {
        return res.status(400).json({
          error: 'code_already_exists'
        })
      }
    }

    let module = await Module.findById(id)

    if (!module) {
      return res.status(404).json({
        error: 'module_not_found'
      })
    }

    const updatedFields = updateFieldsParser({
      name,
      code,
      type,
      extras,
      status,
      baseUrl,
      imageUrl,
      description
    })

    await module.updateOne({
      ...updatedFields,
      updatedAt: new Date()
    })

    module = await Module.findById(id)

    return res.json({
      module
    })
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: "internal_server_error"
    }) 
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const Module = ModuleSchema.Model()
    const { id } = req.params

    const module = await Module.findById(id)

    if (!module) {
      return res.status(404).json({
        error: 'module_not_found'
      })
    }

    await module.deleteOne()

    return res.json({
      deletedId: id
    })
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: "internal_server_error"
    })
  }
})

module.exports = router