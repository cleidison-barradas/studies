// Router
const router = require('express').Router()
// Helpers
const updateFieldsParser = require('myp-admin/helpers/update-fields.parser')
// Middlewares
const { objectIdValidation } = require('myp-admin/http/middlewares')

const { getModelByTenant } = require('myp-admin/database/mongo')
const { ProductControlSchema } = require('myp-admin/database/mongo/models')

/**
 * List or detail entity
 */
router.get('/:id?', objectIdValidation, async (req, res) => {
    const { id } = req.params
    const ProductControl = ProductControlSchema.Model()

    if (id) {
        const productControl = await ProductControl.findById(id)

        if (!productControl) {
            return res.status(404).json({
                error: 'productControl_not_found',
            })
        }

        return res.json({
            productControl,
        })
    }
    const productControls = await ProductControl.find({})

    return res.json({
        productControls,
    })
})

/**
 * Store a new entity
 */
router.put('/', async (req, res) => {
    const { initials, description } = req.body

    const ProductControl = ProductControlSchema.Model()

    const productControl = await ProductControl.create({
        initials,
        description,
    })

    return res.json({
        productControl,
    })
})

/**
 * Update an existing entity
 */
router.post('/:id', objectIdValidation, async (req, res) => {
    const { id } = req.params
    const { initials, description } = req.body

    const ProductControl = ProductControlSchema.Model()
    const Product = getModelByTenant(req.tenant, 'ProductSchema')

    let productControl = await ProductControl.findById(id)

    if (!productControl) {
        return res.status(404).json({
            error: 'productControl_not_found',
        })
    }

    const updateFields = updateFieldsParser({
        initials,
        description,
    })

    // Update data
    await productControl.updateOne({
        ...updateFields,
        updatedAt: Date.now(),
    })

    // Get updated data
    productControl = await ProductControl.findById(id)

    await Product.updateMany(
        { 'control._id': productControl._id },
        { control: productControl }
    )

    return res.json({
        productControl,
    })
})

/**
 * Delete an existing entity
 */
router.delete('/:id', objectIdValidation, async (req, res) => {
    const { id } = req.params
    const ProductControl = ProductControlSchema.Model()
    const Product = getModelByTenant(req.tenant, 'ProductSchema')

    const productControl = await ProductControl.findById(id)

    if (!productControl) {
        return res.status(404).json({
            error: 'productControl_not_found',
        })
    }

    // Make deletion
    await productControl.delete()
    await Product.updateMany(
        { 'control._id': productControl._id },
        { control: null }
    )

    return res.json({
        deletedId: id,
    })
})

module.exports = router
