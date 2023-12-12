const router = require('express').Router()
// Mongo ORM
const { ORM, IntegrationUserErpRepository } = require('@mypharma/api-core')
// JWT
const { jwtSign, jwtVerify } = require('../../jwt')

router.get('/', async (req, res) => {
  try {
    await ORM.setup()
    const auth = req.headers.authorization

    if (!auth) {
      return res.status(401).json({
        error: 'missing_authorization'
      })
    }

    let token = auth.replace('Bearer ', '')
    const payload = await jwtVerify(token)
    const { customer_id, email, password } = payload

    const user = await IntegrationUserErpRepository.repo().findById(customer_id)

    if (!user) {
      return res.status(404).json({
        error: 'user_not_found'
      })
    }

    token = await jwtSign(customer_id, email, password)

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
