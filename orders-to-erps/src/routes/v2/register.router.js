const router = require('express').Router()
// Mongo ORM
const { ORM, IntegrationUserErpRepository, IntegrationErpRepository } = require('@mypharma/api-core')
const { ObjectId } = require('bson')
// Encrypt
const sha1 = require('js-sha1')
// JWT
const { jwtSign } = require('../../jwt')
const { DATABASE_INTEGRATION } = process.env

router.post('/', async (req, res) => {
  try {
    await ORM.setup()
    const { userName, email, password, erpId = [], is_admin = false } = req.body
    const encryptedPassword = sha1(password)

    let user = await IntegrationUserErpRepository.repo().findOne({
      where: {
        $or: [{ email }, { userName }]
      }
    })

    if (user) {
      return res.status(401).json({
        error: 'email_or_username_alread_used'
      })
    }
    await ORM.setup(null, DATABASE_INTEGRATION)
    let erps = await IntegrationErpRepository.repo(DATABASE_INTEGRATION).find({ _id: { $in: erpId.map(id => new ObjectId(id)) } })
    
    erps = erps.map(e => new ObjectId(e._id))

    user = await IntegrationUserErpRepository.repo().save({
      email,
      userName,
      password: encryptedPassword,
      token: '',
      store: [],
      admin: is_admin,
      erpId: erps,
      createdAt: new Date()
    })

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
        email: user.email
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
