// Router
const router = require('express').Router()
const { ObjectId } = require('bson')
const { removeMany } = require('myp-admin/services/aws')
const { getModelByTenant } = require('myp-admin/database/mongo')
/**
 * Delete an existing entity
 */
router.post('/delete', async (req, res) => {
    try {
        const Category = getModelByTenant(req.tenant, 'CategorySchema')
        const Product = getModelByTenant(req.tenant, 'ProductSchema')
        const { ids = [] } = req.body
        let objIDs = []
        let deletedId = 0

        for await (id of ids) {
            objIDs.push(ObjectId(id))
        }

        if (ids.length > 0) {
            for (const objID of objIDs) {

                /**Remove category from subcategories list of other categories */
                await Category.updateMany(
                    { 'parentId': '0' },
                    {
                        $pull:
                            { subCategories: { _id: objID } }
                    }
                )

                /**Remove category from products */
                await Product.updateMany(
                    { 'category.0': { $exists: true } },
                    {
                        $pull:
                            { category: { _id: objID } }
                    }
                )
            }

            const categorys = await Category.find({ _id: { $in: ids } })
            const keys = categorys.filter((value) => value.image).map((value) => ({ Key: value.image }))

            if (keys.length > 0) await removeMany(keys)

            const { deletedCount } = await Category.deleteMany({ _id: { $in: ids } })
            deletedId = deletedCount

            await Product.updateMany({ 'category._id': { $in: ids } }, { $set: { category: [] } })

            return res.json({
                deletedId,
            })
        }

        return res.status(400).json({
            error: 'categories_not_provided',
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: 'internal_server_error',
        })
    }
})

/**
 * Update many categories
 */

router.post('/update', async (req, res) => {
    try {
        const Category = getModelByTenant(req.tenant, 'CategorySchema')
        const Product = getModelByTenant(req.tenant, 'ProductSchema')
        const { ids = [], status = true } = req.body

        if (ids.length > 0) {
            await Category.updateMany({ _id: { $in: ids } }, { $set: { status } })
            await Product.updateMany({ 'category._id': { $in: ids } }, { $set: { status } })

            return res.json({ ok: true })
        }

        return res.status(400).json({
            error: 'categories_not_provided',
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: 'internal_server_error',
        })
    }
})
module.exports = router
