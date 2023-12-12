const { IntegrationUserErpRepository, ORM } = require('@mypharma/api-core')
const { jwtVerify } = require('../jwt')

module.exports = async (req, res, next) => {
  await ORM.setup()
  const auth = req.headers.authorization

  if (!auth) {
    return res.status(403).json({
      error: 'missing_authorization'
    })
  }

  const token = auth.replace('Bearer ', "")

  if (!token) {
    return res.status(403).json({
      error: 'invalid_token'
    })
  }

  const payload = await jwtVerify(token)

  const { customer_id, email, password } = payload

  const user = await IntegrationUserErpRepository.repo().findById(customer_id)

  if (!user) {
    return res.status(403).json({
      error: 'invalid_token'
    })
  }
  req.user = user

  next()
}
