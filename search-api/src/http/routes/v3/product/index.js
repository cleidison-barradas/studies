const { elasticSearch } = require('../../../../services')

const router = require('express').Router()

router.post('/:slug', async (req, res) => {

    try {
        const { slug } = req.params
        const { tenant } = req.body

        if (!(await elasticSearch.exists({ prefix: 'mongo_store', storeId: tenant }))) {

            return res.status(404).json({
                error: 'store_index_not_found'
            })
        }

        const response = await elasticSearch.getBySlug({
            prefix: 'mongo_store',
            tenant: tenant,
            slug,
        })

        const hits = response.hits

        const product = hits.hits[0] || null

        return res.json({
            product
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            product: null
        })
    }
})

module.exports = router