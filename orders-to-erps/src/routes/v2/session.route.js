const router = require('express').Router()
// Mongo ORM
const { ORM, IntegrationUserErpRepository } = require('@mypharma/api-core')
// Encrypt
const sha1 = require('js-sha1')
// JWT
const { jwtSign } = require('../../jwt')

router.post('/', async (req, res) => {
  try {
    await ORM.setup()
    const { email, password } = req.body

    const encryptedPassword = sha1(password)

    let user = await IntegrationUserErpRepository.repo().findOne({
      where: {
        $and: [{ email }, { password: encryptedPassword }]
      }
    })

    if (!user) {
      return res.status(401).json({
        error: 'invalid_credentials'
      })
    }

    const token = await jwtSign(user._id, user.email, user.password)

    await IntegrationUserErpRepository.repo().updateOne(
      { _id: user._id },
      { $set: { token } }
    )

    return res.json({
      access_token: token,
      user: {
        user_id: user._id,
        username: user.userName,
        email: user.email,
        is_admin: user.admin
      }
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }

})

module.exports = router
