// Router
const router = require('express').Router()

const { StoreSchema } = require('myp-admin/database/mongo/models')
// Helpers
const { queryData } = require('../../../../services/ganalytics')

router.get('/getinfo', async (req, res) => {
  try {
    const Store = StoreSchema.Model()
    const store = await Store.findById(req.store)
    if (!store) {
      return res.status(404).json({
        error: 'store_not_found'
      })
    }
    queryData(req.query, store, res)
  } catch (error) {
    return res.status(500).json({ error })
  }
})

module.exports = router
