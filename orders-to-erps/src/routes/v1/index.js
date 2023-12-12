const router = require('express').Router();

const registerRoute = require('./register.route');
const sessionRoute = require('./session.route');
const integration = require('./integration.route');
const settingsRoute = require('./settings.route');
const renewRoute  = require('./renew.route');

router.use('/register', registerRoute);
router.use('/session', sessionRoute);
router.use('/integration', integration);
router.use('/settings', settingsRoute);
router.use('/user/renew', renewRoute)

module.exports = router;