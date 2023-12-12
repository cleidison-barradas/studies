const router = require('express').Router()

const registerRoute = require('./register.router')
const sessionRoute = require('./session.route')
const renewRoute = require('./renew.route')
const integrationRoute = require('./integration.route')
const updateRoute = require('./update.route')
const storeGenerateToken = require('./store-generate-token.route')

router.use('/register', registerRoute)
router.use('/session', sessionRoute)
router.use('/user/renew', renewRoute)
router.use('/integration', integrationRoute)
router.use('/update', updateRoute)
router.use('/token', storeGenerateToken)

module.exports = router
