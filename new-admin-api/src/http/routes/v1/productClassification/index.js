// Router
const router = require('express').Router()
const updateFieldsParser = require('myp-admin/helpers/update-fields.parser')
// Middlewares
const { objectIdValidation } = require('myp-admin/http/middlewares')

const {
    Models: {
        ProductClassificationSchema
    },
    getModelByTenant,
} = require('myp-admin/database/mongo')


router.get('/:id?', objectIdValidation, async (req, res) => {
    const { id } = req.params
    const ProductClassification = ProductClassificationSchema.Model()

    if (id) {
        const classification = await ProductClassification.findById(id)

        if (!classification) {
            return res.status(404).json({
                error: 'classification_not_found',
            })
        }

        return res.json({
            classification,
        })
    }
    const classifications = await ProductClassification.find({})

    return res.json({
        classifications,
    })
})

/**
 * Store a new entity
 */
router.put('/', async (req, res) => {
    const { name } = req.body

    const ProductClassification = ProductClassificationSchema.Model()

    const classification = await ProductClassification.create({
        name,
    })

    res.json({
        classification,
    })
})

/**
 * Update an existing entity
 */
router.post('/:id', objectIdValidation, async (req, res) => {
    try {
        const Product = getModelByTenant(req.tenant, 'ProductSchema')
        const ProductClassification = ProductClassificationSchema.Model()
        const { id } = req.params
        const { name } = req.body

        let classification = await ProductClassification.findById(id)

        if (!classification) {
            return res.status(404).json({
                error: 'ProductClassification_not_found',
            })
        }

        const updateFields = updateFieldsParser({
            name,
        })

        // Update data
        await classification.updateOne({
            ...updateFields,
            updatedAt: Date.now(),
        })

        // Get updated data
        classification = await ProductClassification.findById(id)

        await Product.updateMany(
            { 'classification._id': classification._id },
            { classification }
        )

        return res.json({
            classification,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: 'internal_sever_error'
        })
    }
})

/**
 * Delete an existing entity
 */
router.delete('/:id', objectIdValidation, async (req, res) => {
    try {
        const { id } = req.params
        const Product = getModelByTenant(req.tenant, 'ProductSchema')
        const ProductClassification = ProductClassificationSchema.Model()

        const classification = await ProductClassification.findById(id)

        if (!classification) {
            return res.status(404).json({
                error: 'ProductClassification_not_found',
            })
        }

        // Make deletion
        await classification.delete()
        await Product.updateMany(
            { 'classification._id': classification._id },
            { classification: null }
        )

        return res.json({
            deletedId: id,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: 'internal_sever_error'
        })

    }
})

module.exports = router
