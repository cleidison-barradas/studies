const router = require('express').Router()
// Mongo Schemas
const { Mongo: { Models: { UserSchema } } } = require('myp-admin/database')
// Password encryption
const sha1 = require('js-sha1')
// Jwt token
const { userTokenHandler } = require('myp-admin/services/jwt')
// Rules Middleware
const { rulesMiddleware } = require('myp-admin/http/middlewares')
// Rules
const requestRules = require('./rules')

router.use((req, res, next) => rulesMiddleware(req, res, next, requestRules))

router.post('/', async (req, res) => {
  const User = UserSchema.Model()
  const { userName, password, role = 'store' } = req.body
  try {
    let user = await User.findOne({ userName, status: 'active', role }).select('+password');

    if (!user) {
      return res.status(401).json({ error: 'invalid_credential' })
    }

    const encryptedPassword = sha1(user.salt + sha1(user.salt + sha1(password)))
    const passwordConfirm = await User.exists({ userName, password: encryptedPassword })

    if (!passwordConfirm) {
      return res.status(401).json({ error: 'invalid_credential' })
    }

    const { accessToken, refreshToken } = await userTokenHandler(user);

    user = { ...user.toObject(), password: null }
    delete user.password

    return res.json({
      accessToken,
      refreshToken,
      user
    })

  } catch (error) {
    return res.status(500).json({
      error: error.message
    })
  }
})

router.post('/account/remove-session', async (req, res) => {
  try {
    const { ...rest } = req.body
    console.log(rest)

    return res.json({
      url: 'https://myp-redirect.mypharma.com.br/account',
      confirmation_code: '12345'
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
})

module.exports = router
