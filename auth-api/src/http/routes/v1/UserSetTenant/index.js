const router = require('express').Router()

const {
  Mongo: {
    Models: { StoreSchema }
  }
} = require('myp-admin/database')
const { objectIdValidation } = require('myp-admin/http/middlewares')

const { userTokenHandler } = require('myp-admin/services/jwt')

const authMiddleware = require('myp-admin/http/middlewares/auth.middleware')

router.get('/:id', objectIdValidation, authMiddleware, async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  if (!user) {
    return res.status(400).json({
      error: 'user_not_signed'
    })
  }

  const store = await StoreSchema.Model().findById(id)

  if (!store) {
    return res.status(404).json({ error: 'invalid_session store not found' });
  }

  const { accessToken, refreshToken } = await userTokenHandler(user, store);

  return res.json({
    accessToken,
    refreshToken,
    store
  })
})

module.exports = router
