const router = require('express').Router()
const sha1 = require('js-sha1')
const moment = require('moment')
const uuidGenerator = require('uid-generator')
const { ECOMMERCE_SITE } = process.env
const { parseUserRegisterREQ } = require('./customerRegister')
const { checkTenantMiddleware, rulesMiddleware } = require('myp-admin/http/middlewares')
const { Mongo: { getModelByTenant, Models: { PasswordRecoverySchema } } } = require('myp-admin/database')
const { userTokenHandler, jwtVerify } = require('myp-admin/services/jwt')
const { getAcessTokenFB, getProfileFB, getAccessTokenGO, getProfileGO } = require('myp-admin/utils/oauth')

router.use(checkTenantMiddleware)

router.use((req, res, next) => {
  req.models = {
    customer: getModelByTenant(req.store.tenant, 'CustomerSchema'),
    store: getModelByTenant(req.store.tenant, 'StoreSchema')
  }
  next()
})
const rules = require('./rules')
const { sendRecoverEmail } = require('myp-admin/services/mailer')

router.use((req, res, next) => rulesMiddleware(req, res, next, rules))

router.post('/session', async (req, res) => {
  try {
    const Customer = getModelByTenant(req.store.tenant, 'CustomerSchema')
    let { email, password } = req.body
    email = email.toLowerCase()

    const customer = await Customer.findOne({ email }).select('+password')

    if (!customer) {
      return res.status(403).json({
        error: 'invalid_credentials'
      })
    }
    const encryptedPassword = sha1(customer.salt + sha1(customer.salt + sha1(password)))
    const passwordConfirm = await Customer.exists({ email, password: encryptedPassword })

    if (!passwordConfirm) {
      return res.status(403).json({
        error: 'invalid_credentials'
      })
    }

    const { accessToken, refreshToken } = await userTokenHandler(customer, req.store)


    return res.json({
      accessToken,
      refreshToken,
      user: {
        cpf: customer.cpf,
        email: customer.email,
        telephone: customer.phone,
        customer_id: customer._id,
        lastname: customer.lastname,
        firstname: customer.firstname,
        birthdate: customer.birthdate
      }
    })


  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })

  }
})

router.post('/newsletter', async (req, res) => {
  try {
    const Customer = getModelByTenant(req.store.tenant, 'CustomerSchema')
    const { email } = req.body;

    const user = await Customer.exists({ email });

    if (user) return res.status(200).json({ email });

    await Customer.create({ 
      email,
      lastname: " ",
      firstname: " ",
      password: " ",
    });

    return res.status(200).json({ email });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "internal_server_error" });
  }
})

router.post('/register', async (req, res) => {
  try {
    const Customer = getModelByTenant(req.store.tenant, 'CustomerSchema')
    req.body = parseUserRegisterREQ(req.body)
    const {
      cpf = '',
      email,
      password,
      firstname,
      telephone,
      lastname,
    } = req.body

    if (cpf && cpf.length > 0 && cpf !== undefined) {
      const documentExist = await Customer.exists({ cpf: cpf })

      if (documentExist) {
        return res.status(400).json({
          error: 'cpf_already_exist'
        })
      }
    }

    const salt = Math.random().toString(36).substring(7);
    const encryptedPassword = sha1(salt + sha1(salt + sha1(password)));


    Customer.findOne({ email }).then(customerExist => {
      if (customerExist === null) {
        Customer.create({
          firstname,
          lastname,
          fullName: `${firstname} ${lastname}`,
          email,
          phone: telephone,
          salt,
          cpf: cpf,
          password: encryptedPassword
        }).then(customer => {
          userTokenHandler(customer, req.store).then(({ accessToken, refreshToken }) => {
            return res.json({
              accessToken,
              refreshToken,
              user: {
                cpf: customer.cpf,
                customer_id: customer._id,
                firstname: customer.firstname,
                lastname: customer.lastname,
                email: customer.email,
                telephone: customer.phone,
                status: customer.status
              }
            })
          })

        })
      } else {
        return res.status(400).json({
          error: 'email_already_exits'
        })
      }
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })

  }
})

router.post('/update', async (req, res) => {
  try {
    const Customer = getModelByTenant(req.store.tenant, 'CustomerSchema')
    const {
      firstname,
      lastname,
      telephone,
      birthdate
    } = req.body
    let { email } = req.body
    email = email.toLowerCase()

    let customer = await Customer.findOne({ email })

    if (!customer) {
      return res.status(404).json({
        error: 'customer_not_found'
      })
    }

    let updateObj = {}

    if (email) {
      updateObj = {
        ...updateObj,
        email
      }
    }
    if (lastname) {
      updateObj = {
        ...updateObj,
        lastname
      }
    }
    if (firstname) {
      updateObj = {
        ...updateObj,
        firstname
      }
    }
    if (telephone) {
      updateObj = {
        ...updateObj,
        phone: telephone
      }
    }
    if (birthdate) {
      updateObj = {
        ...updateObj,
        birthdate
      }
    }

    if (Object.keys(updateObj).length > 0) {
      await customer.updateOne({
        ...updateObj
      })
    }

    customer = await Customer.findOne({ email })

    return res.json({
      user: {
        firstname: customer.firstname,
        lastname: customer.lastname,
        email: customer.email,
        telephone: customer.phone,
        birthdate: customer.birthdate
      }
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })

  }
})

router.post('/login/email', async (req, res) => {
  let { email } = req.body
  email = email.toLowerCase()

  try {
    const Customer = getModelByTenant(req.store.tenant, 'CustomerSchema')
    const customer = await Customer.findOne({ email: email })

    if (!customer) {
      return res.json({
        exist: false,
        name: null
      })
    }

    res.json({
      exist: true,
      name: customer.firstname.trim()
    })

  } catch (error) {
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }

})

router.post('/facebook/callback', async (req, res) => {
  try {
    const { code } = req.body
    const Customer = getModelByTenant(req.store.tenant, 'CustomerSchema')

    if (!code) {
      return res.status(400).json({
        error: 'access_code_not_provided'
      })
    }

    const { access_token } = await getAcessTokenFB(code)

    if (access_token) {
      let { email, first_name, last_name } = await getProfileFB(access_token)
      email = email.toLowerCase()

      if (!email) {
        return res.status(400).json({
          error: 'missing_email'
        })
      }

      Customer.findOne({ email }).then(customerExists => {

        if (customerExists === null) {
          const salt = Math.random().toString(36).substring(7);
          const encryptedPassword = sha1(salt + sha1(salt + sha1(salt)))

          Customer.create({
            firstname: first_name,
            lastname: last_name,
            fullName: `${first_name} ${last_name}`,
            email,
            salt,
            password: encryptedPassword
          }).then(customer => {
            userTokenHandler(customer, req.store).then(({ accessToken, refreshToken }) => {

              return res.json({
                accessToken,
                refreshToken,
                user: {
                  _id: customer._id,
                  fullName: customer.fullName,
                  firstname: customer.firstname,
                  lastname: customer.lastname,
                  email: customer.email,
                  telephone: customer.phone,
                }
              })
            })
          })
        } else {

          userTokenHandler(customerExists, req.store).then(({ accessToken, refreshToken }) => {

            return res.json({
              accessToken,
              refreshToken,
              user: {
                cpf: customerExists.cpf,
                _id: customerExists._id,
                email: customerExists.email,
                telephone: customerExists.phone,
                fullName: customerExists.fullName,
                lastname: customerExists.lastname,
                firstname: customerExists.firstname,
              }
            })
          })
        }
      })
    } else {
      res.status(403).json({
        error: 'invalid_session'
      })
    }

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }

})

router.post('/google/callback', async (req, res) => {
  try {
    const { code } = req.body
    const Customer = getModelByTenant(req.store.tenant, 'CustomerSchema')

    if (!code) {
      return res.status(400).json({
        error: 'access_code_not_provided'
      })
    }

    const { id_token } = await getAccessTokenGO(code)

    if (id_token) {
      let { email, given_name, family_name } = await getProfileGO(id_token)
      email = email.toLowerCase()

      if (!email) {
        return res.status(400).json({
          error: 'missing_email'
        })
      }

      Customer.findOne({ email }).then(customerExists => {

        if (customerExists === null) {
          const salt = Math.random().toString(36).substring(7);
          const encryptedPassword = sha1(salt + sha1(salt + sha1(salt)))

          Customer.create({
            firstname: given_name,
            lastname: family_name,
            fullName: `${given_name} ${family_name}`,
            email,
            salt,
            password: encryptedPassword
          }).then(customer => {
            userTokenHandler(customer, req.store).then(({ accessToken, refreshToken }) => {

              return res.json({
                accessToken,
                refreshToken,
                user: {
                  customer_id: customer._id,
                  firstname: customer.firstname,
                  lastname: customer.lastname,
                  email: customer.email,
                  telephone: customer.phone,
                  status: customer.status

                }
              })
            })
          })
        } else {

          userTokenHandler(customerExists, req.store).then(({ refreshToken, accessToken }) => {

            return res.json({
              accessToken,
              refreshToken,
              user: {
                cpf: customerExists.cpf,
                _id: customerExists._id,
                email: customerExists.email,
                telephone: customerExists.phone,
                fullName: customerExists.fullName,
                lastname: customerExists.lastname,
                firstname: customerExists.firstname,
              }
            })
          })
        }
      })
    } else {
      res.status(403).json({
        error: 'invalid_session'
      })
    }

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
})

router.get('/renew', async (req, res) => {
  try {
    const Customer = getModelByTenant(req.store.tenant, 'CustomerSchema')
    const auth = req.headers.authorization

    if (!auth) {
      return res.status(403).json({
        error: 'missing_authorization'
      })
    }

    const token = auth.replace('Bearer ', '');

    const payload = await jwtVerify(token)
    const { objectId } = payload

    const customer = await Customer.findById(objectId)

    if (!customer) {
      return res.status(404).json({
        errror: 'customer_not_found'
      })
    }

    const { accessToken, refreshToken } = await userTokenHandler(customer, req.store)

    return res.json({
      accessToken,
      refreshToken,
      user: {
        customer_id: customer._id,
        firstname: customer.firstname,
        lastname: customer.lastname,
        email: customer.email,
        telephone: customer.phone,
        birthdate: customer.birthdate,
        status: customer.status

      }
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
})

router.get('/renew/refresh', async (req, res) => {
  try {
    const Customer = getModelByTenant(req.store.tenant, 'CustomerSchema')
    const auth = req.headers.authorization

    if (!auth) {
      return res.status(403).json({
        error: 'missing_authorization'
      })
    }

    const token = auth.replace('Bearer ', '');

    const customer = await Customer.findOne({ refreshToken: token })

    if (!customer) {
      return res.status(404).json({
        errror: 'customer_not_found'
      })
    }

    const { accessToken, refreshToken } = await userTokenHandler(customer, req.store)

    return res.json({
      accessToken,
      refreshToken,
      user: {
        cpf: customer.cpf,
        email: customer.email,
        telephone: customer.phone,
        customer_id: customer._id,
        lastname: customer.lastname,
        firstname: customer.firstname,
        birthdate: customer.birthdate
      }
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
})

router.post('/login/recover', async (req, res) => {
  try {
    const Customer = getModelByTenant(req.store.tenant, 'CustomerSchema')
    const Recovery = PasswordRecoverySchema.Model()
    let { email } = req.body
    email = email.toLowerCase()

    const uuidGen = new uuidGenerator(512, uuidGenerator.BASE62)

    if (!email) {
      return res.status(400).json({
        error: 'missing_email'
      })
    }

    const customer = await Customer.findOne({ email })

    if (!customer) {
      return res.status(404).json({
        error: 'customer_not_found'
      })
    }

    const recoveryRequest = await Recovery.findOne({ user: customer._id, status: 'active' })
    const now = moment()

    if (recoveryRequest && now.isSameOrBefore(recoveryRequest.expires)) {
      return res.status(400).json({
        message: 'email de recuperação já enviado'
      })
    }

    const token = await uuidGen.generate()

    const recovery = await Recovery.create({
      token,
      user: customer._id,
      createdAt: new Date(),
      expires: moment().add(2, 'hours').toDate()
    })

    // Check if is Development
    let baseUrl = process.env.NODE_ENV === 'production' ? req.store.url : ECOMMERCE_SITE

    if (baseUrl.substring(baseUrl.length - 1).includes('/')) {

      baseUrl = baseUrl.substring(0, baseUrl.length - 1)
    }

    await sendRecoverEmail({
      receiver: email,
      username: customer.fullName,
      recoverUrl: new URL(`/recuperar-senha/${token}`, req.store.url),
      expires: moment().add(2, 'hours').fromNow(),
      from: req.store.settings.config_email || process.env.SENDGRID_EMAIL_SENDER,
    }).catch(async (err) => {
      console.log(err)
      await recovery.updateOne({ status: 'disabled' })
      return res.status(500).json({ message: 'Não foi possivel enviar o email de recuperação de senha' })
    })

    return res.json({ ok: true })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
})

router.post(`/login/reset-password/:token`, async (req, res) => {
  try {
    const Customer = getModelByTenant(req.store.tenant, 'CustomerSchema')
    const Recovery = PasswordRecoverySchema.Model()
    const { token } = req.params
    const { password } = req.body

    if (!token) {
      return res.status(401).json({
        errror: 'missing_token'
      })
    }

    const recoverIt = await Recovery.findOne({ token }).select('+token')

    if (!recoverIt) {
      return res.status(404).json({
        errror: 'recover_password_not_found'
      })
    }

    const { user } = recoverIt

    const customer = await Customer.findById(user)

    if (!customer) {
      return res.status(404).json({
        errror: 'customer_not_found'
      })
    }

    const salt = Math.random().toString(36).substring(7);
    const encryptedPassword = sha1(salt + sha1(salt + sha1(password)));

    await customer.updateOne({
      salt,
      password: encryptedPassword
    })

    await recoverIt.updateOne({
      status: 'disabled',
      expires: moment().toDate()
    })

    return res.json({ ok: true })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: 'internal_server_error'
    })
  }
})

router.get('/login/validate-reset-password/:token', async (req, res) => {
  try {
    const Recovery = PasswordRecoverySchema.Model()
    const { token } = req.params

    if (!token) {
      return res.json({
        valid: false
      })
    }

    const recoveryValid = await Recovery.findOne({ token }).select(['+token', '+expires'])

    if (!recoveryValid) {

      return res.json({
        valid: false
      })
    }
    const currenTime = moment()
    const expires_at = moment(recoveryValid.expires)

    if (currenTime.isSameOrAfter(expires_at)) {

      await recoveryValid.updateOne({
        status: 'expired',
        expires: currenTime.toDate()
      })

      return res.json({
        valid: false
      })
    }

    return res.json({
      valid: true
    })


  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
})

module.exports = router