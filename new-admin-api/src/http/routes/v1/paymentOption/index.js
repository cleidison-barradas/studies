const router = require('express').Router()
const {
    Models: { PaymentOptionSchema },
} = require('myp-admin/database/mongo')

router.get('/', async (req, res) => {
    try {
        const PaymentOption = PaymentOptionSchema.Model()

        const paymentOptions = await PaymentOption.find().sort('name')

        if (!paymentOptions) {
            return res.status(404).json({
                error: 'payments_not_found',
            })
        }

        res.json({
            paymentOptions,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: 'internal_server_error',
        })
    }
})

router.put('/', async (req, res) => {
    try {
        const PaymentOption = PaymentOptionSchema.Model()
        const { paymentOption } = req.body
        const { name, type } = paymentOption

        const sameNamePaymentOption = await PaymentOption.exists({ name })

        if (sameNamePaymentOption) {
            return res.status(400).json({
                error: 'payment_option_name_already_exists',
            })
        }

        const paymentOptions = await PaymentOption.create({
            name,
            type,
        })

        return res.json({
            paymentOptions,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: 'internal_server_error',
        })
    }
})

module.exports = router
