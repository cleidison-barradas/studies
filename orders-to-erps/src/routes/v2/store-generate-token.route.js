const router = require('express').Router()
// Mongo ORM
const { ORM, IntegrationUserErpRepository, StoreRepository } = require('@mypharma/api-core')

const { ObjectId } = require('bson')
// Token to Store
const { v4 } = require('uuid')

router.post('/generate', async (req, res) => {
  try {
    await ORM.setup()
    const { email, storeId } = req.body

    let user = await IntegrationUserErpRepository.repo().findOne({ email })

    if (!user) {
      return res.status(404).json({
        error: 'integration_not_found'
      })
    }

    const store = await StoreRepository.repo().findById(storeId)

    if (!store) {
      return res.status(404).json({
        error: 'store_not_found'
      })
    }

    if (!user.store.filter(s => s._id.toString() === store._id.toString()).length > 0) {
      const token = v4()
  
      await IntegrationUserErpRepository.repo().findOneAndUpdate(
        { _id: new ObjectId(user._id) },
        { $push: { store: { ...store, _id: new ObjectId(store._id), token } } 
      })
    }

    return res.json({ ok: true })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
})

module.exports = router
