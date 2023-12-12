const router = require('express').Router()
const { hash } = require('bcrypt')
const sha1 = require('js-sha1')

const {
  Mongo: {
    Models: { UserSchema, PasswordRecoverySchema },
  },
} = require('myp-admin/database')

const { rulesMiddleware } = require('myp-admin/http/middlewares')

const requestRules = require('./rules')
router.use((req, res, next) => rulesMiddleware(req, res, next, requestRules))

router.put('/', async (req, res) => {
  try {
    const User = UserSchema.Model()
    const Recovery = PasswordRecoverySchema.Model()
    const { userId, token, password } = req.body
    const [active, expired, disable] = Recovery.schema.path('status').enumValues

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: 'user_not_found' })
    }

    const recovery = await Recovery.findOne({ user: userId, status: active, token: token }).select('+token expires')
    if (!recovery) {
      return res.status(404).json({ error: 'no recovery request found' })
    }

    const now = new Date()
    if (now > recovery.expires) {
      recovery.status = expired
      await recovery.save()
      return res.status(404).json({ error: 'token expired generate a new one' })
    }

    const salt = Math.random().toString(36).substring(7)
    const encryptedPassword = sha1(salt + sha1(salt + sha1(password)))

    user.password = encryptedPassword
    user.salt = salt
    
    await user.save()

    recovery.status = disable
    await recovery.save()

    return res.json({ message: 'password successfully changed' })
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})

module.exports = router
