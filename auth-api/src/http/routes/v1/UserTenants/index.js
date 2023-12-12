const router = require('express').Router()

const { Mongo: { Models: { UserSchema } } } = require('myp-admin/database')
const { StoreSchema } = require('myp-admin/database/mongo/models')

const authMiddleware = require('myp-admin/http/middlewares/auth.middleware')

router.get('/', authMiddleware , async (req, res) => {
  const User = UserSchema.Model()
  const Store = StoreSchema.Model()
  const { _id } = req.user;

  const { store } = await User.findById(_id).select('store')

  const stores = await Store.find({ _id: { $in: store }})
 
  if (!store) {
    return res.status(401).json({ error: 'invalid_session' })
  }

  return res.json({
    tenants : stores
  })

})

module.exports = router
