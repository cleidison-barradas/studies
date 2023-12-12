const router = require('express').Router()

const { Mongo: { Models: { UserSchema, StoreSchema } } } = require('myp-admin/database')

const { userTokenHandler } = require('myp-admin/services/jwt')

const { rulesMiddleware } = require('myp-admin/http/middlewares')

const requestRules = require('./rules')
router.use((req, res, next) => rulesMiddleware(req, res, next, requestRules))

router.get('/:token', async (req, res) => {
  const User = UserSchema.Model()
  const Store = StoreSchema.Model()

  const { token } = req.params;

  let user = await User.findOne({ refreshToken: token })

  if (!user) {
    return res.status(401).json({
      error: 'invalid_token',
    });
  }
  
  const stores = await Store.find({ _id: { $in: user.store }})

  if (stores.length > 0) {
    user.store = stores
  }

  const { accessToken, refreshToken } = await userTokenHandler(user);

  return res.json({ 
    accessToken, 
    refreshToken,
    user
  });
})

module.exports = router
