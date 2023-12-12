const router = require('express').Router()
const TokenGenerator = require('uuid-token-generator');
const moment = require('moment')
require('moment/locale/pt-br') 
moment.locale('pt-br')

const { sendRecoverEmail } = require('../../../../services/mailer')
const {
  NEW_ADMIN_URL
} = process.env


const { Mongo: { Models: { PasswordRecoverySchema, UserSchema } } } = require('myp-admin/database')

const { rulesMiddleware } = require('myp-admin/http/middlewares')

const requestRules = require('./rules')
router.use((req, res, next) => rulesMiddleware(req, res, next, requestRules))

router.put('/', async (req, res) => {
  const User = UserSchema.Model()
  const Recovery = PasswordRecoverySchema.Model();
  const { email } = req.body

  try {
    const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: 'user_not_found' });
  }
  const tokenGen = new TokenGenerator(512, TokenGenerator.BASE71)
  const tokenRecovery = tokenGen.generate();
  const now = new Date();
  now.setHours(now.getHours() + 1);

  const { token } = await Recovery.create({
    token: tokenRecovery,
    user: user._id,
    expires: now,
  })

  const response = await sendRecoverEmail({
    receiver: email,
    username: user.userName,
    recoverUrl: `${NEW_ADMIN_URL}/change/password?token=${tokenRecovery}&userId=${user._id}`,
    expires : moment(now).fromNow()
  })

  return res.json(response);
  } catch (error) {
    
  }

})

module.exports = router
