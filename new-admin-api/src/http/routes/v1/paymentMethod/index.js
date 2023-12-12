const router = require('express').Router()
const multer = require('multer')
const {
    Models: { PaymentOptionSchema, PaymentDetailsSchema },
} = require('myp-admin/database/mongo')

const { remove } = require('myp-admin/services/aws')
const { getModelByTenant } = require('myp-admin/database/mongo')
const { objectIdValidation } = require('myp-admin/http/middlewares')
const multerConfig = require('myp-admin/services/certificate.multer')
const GerenciaNet = require('myp-admin/services/GerenciaNetService/GerenciaNetService')

const { WEBHOOK_API_URL } = process.env

const upload = multer(multerConfig)

router.get('/store/:id?', objectIdValidation, async (req, res) => {
    try {
        const { id } = req.params

        const Payment = getModelByTenant(req.tenant, 'PaymentMethodSchema')

        if (id) {
            const payment = await Payment.findById(id)

            if (!payment) {
                return res.status(404).json({
                    error: 'payment_not_found',
                })
            }

            return res.json({
                payment,
            })
        }

        const payments = await Payment.find({})

        return res.json({
            payments,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: 'internal_server_error',
        })
    }
})

router.put('/', async (req, res) => {
    const PaymentMethod = getModelByTenant(req.tenant, 'PaymentMethodSchema')
    const OptionSchema = PaymentOptionSchema.Model()
    const DetailsSchema = PaymentDetailsSchema.Model()

    try {
        let { paymentMethod, covenant = undefined } = req.body
        const { ip = ''} = req

        if(ip.length > 0){
            paymentMethod.updatedBy = { clientIP: ip }
          }

        const optionName = paymentMethod.paymentOption.name

        // Caso seja Stone ou Pagseguro, troca true por false
        const hasActiveBefore = await PaymentMethod.findOne({ active: true })
        if (hasActiveBefore && (optionName === 'Pagseguro' || optionName === 'Stone')) {
            await PaymentMethod.updateOne({ active: true }, { active: false })
        }

        if (!paymentMethod.paymentOption) {
            return res.status(400).json({ error: 'missing payment option' })
        }

        if (paymentMethod._id) {
            await PaymentMethod.updateOne({ _id: paymentMethod._id }, paymentMethod)
            // Seta a flag apenas para Stone ou Pagseguro
            if (optionName === 'Stone' || optionName === 'Pagseguro') {
                return res.json({
                    paymentMethod: await PaymentMethod.findOne({
                        _id: paymentMethod._id,
                        active: true,
                    }),
                })
            } else {
                return res.json({
                    paymentMethod: await PaymentMethod.findOne({
                        _id: paymentMethod._id,
                    }),
                })
            }
        } else {
          if (covenant !== undefined) {
            let paymentOption = null
            let details = null

            if (covenant) {
              const methodExists = await PaymentMethod.findOne({ 'paymentOption.type': 'covenant' })


              if (methodExists) {
                await PaymentMethod.updateOne({ 'paymentOption.type': 'covenant' }, {
                  $set: {
                    'details.payment_maxInstallments': paymentMethod.details.payment_maxInstallments
                  }
                })
              } else {
                paymentOption = await OptionSchema.findOne({ type: 'covenant' })

                if (!paymentOption) {
                  paymentOption = await OptionSchema.create(paymentMethod.paymentOption)
                }

                if (!details) {
                  details = await DetailsSchema.create(paymentMethod.details)
                }

                paymentMethod = await PaymentMethod.create({
                  details,
                  extras: [],
                  paymentOption,
                  updatedBy : { clientIP: ip }
                })
              }

              return res.json({
                paymentMethod,
              })
            } else {
              const methodExists = await PaymentMethod.findOne({ 'paymentOption.type': 'covenant' })

              if (methodExists) {
                await methodExists.deleteOne()
              }

              return res.json({ ok: true })
            }
          }

          paymentMethod = await PaymentMethod.create(paymentMethod)
          return res.json({ paymentMethod })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }
})

router.put('/pix', upload.single('file'), async (req, res) => {
    const PaymentMethod = getModelByTenant(req.tenant, 'PaymentMethodSchema')

    try {
        let { paymentMethod } = req.body
        const file = req.file
        const { ip = ''} = req

        paymentMethod = await JSON.parse(paymentMethod)

        if(ip.length > 0){
            paymentMethod.updatedBy = { clientIP: ip }
        }

        if (file) {
            if (paymentMethod.extras[3]) {
                await remove(paymentMethod.extras[3])
            }
            paymentMethod.extras[3] = file.key
        }

        if (!paymentMethod.paymentOption) {
            return res.status(400).json({ error: 'missing payment option' })
        }

        const [client_id, client_secret, pix_key, certificateKey] = paymentMethod.extras

        const gerenciaNet = new GerenciaNet({
            certificateKey,
            client_id,
            client_secret,
            pix_key,
        })

        try {
            await gerenciaNet.Auth()

            const webhookUrl = new URL(`/pix/${req.tenant}`, WEBHOOK_API_URL).href

            await gerenciaNet.RegisterPixCallback(webhookUrl)

        } catch (error) {
            console.log(error)

            return res.status(500).json({
                error: 'internal_server_error'
            })
        }

        if (paymentMethod._id) {
            const _id = paymentMethod._id
            paymentMethod.updatedAt = new Date()
            await PaymentMethod.updateOne({ _id }, paymentMethod)

            paymentMethod = await PaymentMethod.findById(_id)

            return res.json({
                paymentMethod
            })

        } else {

            paymentMethod = await PaymentMethod.create(paymentMethod)

            return res.json({
                paymentMethod
            })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: 'internal_server_error'
        })
    }
})

router.delete('/:_id', async (req, res) => {
    const Payment = getModelByTenant(req.tenant, 'PaymentMethodSchema')

    try {
        const { _id } = req.params

        const payment = await Payment.findOne({ _id })

        if (payment.paymentOption.name.toLowerCase() === 'pix' && payment.paymentOption.type.toLowerCase() === 'gateway') {
            await remove(payment.extras[3])
        }

        await payment.remove()

        return res.json({ deletedId: _id })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: 'internal_server_error',
        })
    }
})

module.exports = router
